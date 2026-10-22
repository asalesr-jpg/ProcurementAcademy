<?php
// Stakeholder Academy: small JSON-file backend. No database needed.
// Accounts, progress, live class state, polls, questions and course edits are kept as files in data/.
declare(strict_types=1);
require __DIR__ . '/config.php';

const DATA = __DIR__ . '/data';
const STORE = DATA . '/store';
const HEAD = "<?php exit; ?>\n"; // stored files are .php so the web server never shows their contents

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function lc(string $s): string { return function_exists('mb_strtolower') ? mb_strtolower($s) : strtolower($s); }
function out($data, int $code = 200): void { http_response_code($code); echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); exit; }
function fail(string $code, string $msg, int $http = 400): void { out(['error' => ['code' => $code, 'message' => $msg]], $http); }

// ---------- storage ----------
function ensure_dirs(): void {
  foreach ([DATA, STORE, DATA . '/presence'] as $d) if (!is_dir($d)) @mkdir($d, 0775, true);
  if (!is_dir(STORE)) fail('storage', 'The data folder cannot be created. Give the web server write permission on the "data" folder.', 500);
  if (!file_exists(DATA . '/.htaccess')) @file_put_contents(DATA . '/.htaccess', "Require all denied\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n");
  if (!file_exists(DATA . '/index.html')) @file_put_contents(DATA . '/index.html', '');
}
function rd(string $file, bool $assoc = false) {
  if (!is_file($file)) return null;
  $s = @file_get_contents($file);
  if ($s === false) return null;
  if (strncmp($s, HEAD, strlen(HEAD)) === 0) $s = substr($s, strlen(HEAD));
  return json_decode($s, $assoc);
}
function wr(string $file, $data): void {
  $dir = dirname($file);
  if (!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) fail('storage', 'Could not write to the data folder.', 500);
  $tmp = $file . '.' . bin2hex(random_bytes(4)) . '.tmp';
  $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if (@file_put_contents($tmp, HEAD . $json, LOCK_EX) === false || !@rename($tmp, $file)) { @unlink($tmp); fail('storage', 'Could not write to the data folder.', 500); }
}
// one global lock for read-modify-write of shared files
function with_lock(callable $fn) {
  $h = fopen(DATA . '/.lock', 'c'); flock($h, LOCK_EX);
  try { return $fn(); } finally { flock($h, LOCK_UN); fclose($h); }
}

// ---------- paths and permissions ----------
function segs($path): array {
  if (!is_string($path) || $path === '' || strlen($path) > 300) fail('invalid_argument', 'Bad path.');
  $s = explode('/', $path);
  foreach ($s as $p) if (!preg_match('/^[A-Za-z0-9_][A-Za-z0-9_.\-]{0,99}$/', $p) || strpos($p, '..') !== false) fail('invalid_argument', 'Bad path.');
  return $s;
}
function doc_file(array $s): string { if (count($s) % 2) fail('invalid_argument', 'Not a document path.'); return STORE . '/' . implode('/', $s) . '.json.php'; }
function coll_dir(array $s): string { if (!(count($s) % 2)) fail('invalid_argument', 'Not a collection path.'); return STORE . '/' . implode('/', $s); }
// private areas: each student's own work, own requests and own private data
// paths of the second and later courses live under c/<course>/...; the same rules apply inside each course
function strip_ns(array $s): array { return ($s[0] === 'c' && count($s) > 2) ? array_slice($s, 2) : $s; }
function owner_of(array $s): ?string {
  if (in_array($s[0], ['subs', 'requests'], true)) return $s[1] ?? '';
  if ($s[0] === 'data' && ($s[1] ?? '') === 'users') return $s[2] ?? '';
  return null;
}
function can_read(array $s, array $me, bool $coll): bool {
  if ($me['admin']) return true;
  if ($s[0] === 'c' && count($s) <= 2) return false;
  $s = strip_ns($s);
  if ($s[0] === 'teacher') return false; // the teacher's live-class slides and notes
  if ($coll && in_array($s[0], ['subs', 'requests', 'roster'], true) && count($s) === 1) return false;
  if ($coll && $s[0] === 'data') return count($s) >= 3 && $s[2] === $me['id'];
  $o = owner_of($s);
  return $o === null || $o === $me['id'];
}
function can_write(array $s, array $me): bool {
  if ($me['admin']) return true;
  if ($s[0] === 'c' && count($s) <= 2) return false;
  $s = strip_ns($s);
  $id = $me['id'];
  if ($s[0] === 'subs' && ($s[1] ?? '') === $id) return true;
  if (in_array($s[0], ['answers', 'qa', 'requests'], true) && count($s) === 2 && $s[1] === $id) return true;
  if ($s[0] === 'data' && ($s[1] ?? '') === 'users' && ($s[2] ?? '') === $id) return true;
  return false;
}
function read_doc(array $s) {
  $v = rd(doc_file($s));
  // teacher's live-class decks start from the shipped originals until the teacher saves an edit
  $ns = ($s[0] === 'c' && count($s) > 2) ? $s[1] . '/' : '';
  $t = strip_ns($s);
  if ($v === null && count($t) === 2 && $t[0] === 'teacher' && preg_match('/^deck-(s[1-9])$/', $t[1], $m)) {
    $v = rd(__DIR__ . '/seed/' . $ns . 'live-' . $m[1] . '.json.php');
    if (is_object($v)) $v->seed = true;
  }
  return $v;
}
function read_coll(array $s): array {
  $dir = coll_dir($s); $out = [];
  foreach (glob($dir . '/*.json.php') ?: [] as $f) {
    $id = substr(basename($f), 0, -9);
    $v = rd($f); if ($v !== null) $out[] = ['id' => $id, 'data' => $v];
  }
  usort($out, fn($a, $b) => strcmp($a['id'], $b['id']));
  return $out;
}

function rtc_file(array $req): string {
  $room = (string)($req['room'] ?? 'main'); if (!preg_match('/^[a-z0-9_-]{1,40}$/', $room)) $room = 'main';
  return DATA . '/rtc/' . $room . '.json.php';
}
function rtc_push(string $to, array $msg): void {
  if (!preg_match('/^[A-Za-z0-9_]+$/', $to)) return;
  $qf = DATA . '/rtc/q/' . $to . '.json.php';
  $q = rd($qf, true) ?: []; $q[] = $msg; wr($qf, array_slice($q, -200));
}

// ---------- accounts ----------
function users(): array {
  $u = rd(DATA . '/users.json.php', true);
  if (!is_array($u) || empty($u['users'])) {
    $u = ['users' => ['admin' => ['username' => 'admin', 'name' => ADMIN_NAME, 'hash' => ADMIN_INITIAL_HASH, 'admin' => true, 'created' => time()]]];
    wr(DATA . '/users.json.php', $u);
  }
  return $u;
}
function save_users(array $u): void { wr(DATA . '/users.json.php', $u); }
function find_username(array $u, string $username): ?string {
  foreach ($u['users'] as $id => $x) if (strcasecmp($x['username'], $username) === 0) return $id;
  return null;
}
function clean_username($v): string {
  $v = strtolower(trim((string)$v));
  if (!preg_match('/^[a-z0-9][a-z0-9._@\-]{1,63}$/', $v)) fail('invalid_argument', 'Usernames use 2 to 64 letters, numbers, dots, dashes or @, without spaces.');
  return $v;
}
function clean_name($v): string { $v = trim(preg_replace('/\s+/u', ' ', (string)$v)); if ($v === '' || (function_exists('mb_strlen') ? mb_strlen($v) : strlen($v)) > 80) fail('invalid_argument', 'Give a name of up to 80 characters.'); return $v; }
function check_password($v): string { $v = (string)$v; if (strlen($v) < 8 || strlen($v) > 200) fail('invalid_argument', 'Passwords need at least 8 characters.'); return $v; }
function public_user(string $id, array $x): array {
  return ['id' => $id, 'username' => $x['username'], 'name' => $x['name'], 'admin' => !empty($x['admin']), 'created' => $x['created'] ?? null, 'lastLogin' => $x['lastLogin'] ?? null,
    'email' => $x['email'] ?? null, 'team' => $x['team'] ?? null, 'country' => $x['country'] ?? null, 'self' => !empty($x['self']), 'disabled' => !empty($x['disabled'])];
}

function clean_text($v, int $max): string { $v = trim(preg_replace('/\s+/u', ' ', (string)$v)); return function_exists('mb_substr') ? mb_substr($v, 0, $max) : substr($v, 0, $max); }
function course_namespaces(): array { return defined('COURSE_NAMESPACES') ? COURSE_NAMESPACES : ['']; }
function registration_open(): bool { $r = rd(doc_file(['academy', 'registration']), true); return is_array($r) && array_key_exists('open', $r) ? (bool)$r['open'] : (defined('REGISTRATION_OPEN') ? REGISTRATION_OPEN : true); }
function enrol(string $id, string $ns): void { wr(doc_file($ns === '' ? ['roster', $id] : ['c', $ns, 'roster', $id]), ['addedAt' => (int)(microtime(true) * 1000)]); }

// ---------- session ----------
ensure_dirs();
if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('method', 'Use POST.', 405);
if (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'stakeholder-academy') fail('forbidden', 'Missing request header.', 403);
$raw = file_get_contents('php://input', false, null, 0, 16 * 1024 * 1024 + 1);
if (strlen((string)$raw) > 16 * 1024 * 1024) fail('too_large', 'Request too large.', 413);
$req = json_decode((string)$raw, true);
if (!is_array($req) || !isset($req['op'])) fail('invalid_argument', 'Bad request.');
$reqObj = json_decode((string)$raw); // keeps {} as objects in stored data

$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
session_name('sa_session');
session_set_cookie_params(['lifetime' => SESSION_DAYS * 86400, 'path' => rtrim(dirname($_SERVER['SCRIPT_NAME']), '/') . '/', 'secure' => $secure, 'httponly' => true, 'samesite' => 'Lax']);
if (is_dir(DATA . '/sessions') || @mkdir(DATA . '/sessions', 0775, true)) session_save_path(DATA . '/sessions');
ini_set('session.gc_maxlifetime', (string)(SESSION_DAYS * 86400));
session_start();
$op = (string)$req['op'];

function current_user(): ?array {
  $id = $_SESSION['uid'] ?? null; if (!$id) return null;
  $u = users(); $x = $u['users'][$id] ?? null;
  if (!$x || !empty($x['disabled']) || ($_SESSION['pv'] ?? '') !== substr($x['hash'], -12)) { $_SESSION = []; return null; } // password changed, account paused or deleted
  if (time() - ($_SESSION['at'] ?? 0) > SESSION_DAYS * 86400) { $_SESSION = []; return null; }
  return ['id' => $id, 'admin' => !empty($x['admin']), 'name' => $x['name'], 'username' => $x['username']];
}
function login_session(string $id, array $x): void { session_regenerate_id(true); $_SESSION['uid'] = $id; $_SESSION['pv'] = substr($x['hash'], -12); $_SESSION['at'] = time(); }

// ---------- operations without an account ----------
if ($op === 'login') {
  $username = strtolower(trim((string)($req['username'] ?? ''))); $pw = (string)($req['password'] ?? '');
  $res = with_lock(function () use ($username, $pw) {
    $af = DATA . '/attempts.json.php'; $at = rd($af, true) ?: []; $now = time();
    $key = substr(hash('sha256', $username), 0, 16);
    $rec = $at[$key] ?? ['n' => 0, 't' => 0];
    if ($rec['n'] >= 5 && $now - $rec['t'] < 300) return ['locked' => true];
    $u = users(); $id = $username !== '' ? find_username($u, $username) : null;
    $ok = $id && password_verify($pw, $u['users'][$id]['hash']);
    if (!$ok) { $rec = ['n' => ($now - $rec['t'] < 300 ? $rec['n'] : 0) + 1, 't' => $now]; $at[$key] = $rec; wr($af, $at); return ['ok' => false]; }
    unset($at[$key]); wr($af, $at);
    if (!empty($u['users'][$id]['disabled'])) return ['disabled' => true];
    if (password_needs_rehash($u['users'][$id]['hash'], PASSWORD_DEFAULT)) $u['users'][$id]['hash'] = password_hash($pw, PASSWORD_DEFAULT);
    $u['users'][$id]['lastLogin'] = $now; save_users($u);
    return ['ok' => true, 'id' => $id, 'x' => $u['users'][$id]];
  });
  if (!empty($res['locked'])) fail('rate_limited', 'Too many attempts. Wait five minutes and try again.', 429);
  if (!empty($res['disabled'])) fail('disabled', 'This account is paused. Contact the Academy admin.', 403);
  if (!$res['ok']) { usleep(400000); fail('bad_login', 'The username or password is not right.', 401); }
  login_session($res['id'], $res['x']);
  out(['me' => public_user($res['id'], $res['x'])]);
}
if ($op === 'regStatus') { $c = rd(doc_file(['academy', 'catalogue'])); out(['open' => registration_open(), 'courses' => course_namespaces(), 'catalogue' => is_object($c) ? $c : null]); }
if ($op === 'register') {
  // self-registration from the public home page: the account is created and signed in at once (no e-mail confirmation)
  if (!registration_open()) fail('closed', 'Registration is closed at the moment. Contact the Academy admin.', 403);
  if (trim((string)($req['website'] ?? '')) !== '') fail('invalid_argument', 'Bad request.'); // hidden field that only bots fill in
  if (empty($req['consent'])) fail('invalid_argument', 'Please accept how your data is used.');
  $name = clean_name($req['name'] ?? '');
  $email = strtolower(trim((string)($req['email'] ?? '')));
  if (strlen($email) > 64 || !filter_var($email, FILTER_VALIDATE_EMAIL)) fail('invalid_argument', 'Give a valid e-mail address (up to 64 characters).');
  $pw = check_password($req['password'] ?? '');
  $team = clean_text($req['team'] ?? '', 80); $country = clean_text($req['country'] ?? '', 60);
  $all = course_namespaces();
  $courses = array_values(array_intersect($all, array_map('strval', (array)($req['courses'] ?? $all))));
  $ipkey = substr(hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|reg'), 0, 16);
  $res = with_lock(function () use ($name, $email, $pw, $team, $country, $courses, $ipkey) {
    $rf = DATA . '/registrations.json.php'; $rl = rd($rf, true) ?: []; $now = time();
    foreach ($rl as $k => $ts) { $rl[$k] = array_values(array_filter((array)$ts, fn($t) => $now - $t < 3600)); if (!$rl[$k]) unset($rl[$k]); }
    if (count($rl[$ipkey] ?? []) >= 10) return ['limited' => true];
    $u = users();
    if (find_username($u, $email) !== null) return ['exists' => true];
    $id = 'u_' . bin2hex(random_bytes(6));
    $u['users'][$id] = ['username' => $email, 'name' => $name, 'email' => $email, 'team' => $team, 'country' => $country, 'self' => true,
      'hash' => password_hash($pw, PASSWORD_DEFAULT), 'created' => $now, 'lastLogin' => $now];
    save_users($u);
    foreach ($courses as $c) enrol($id, $c);
    $rl[$ipkey][] = $now; wr($rf, $rl);
    return ['id' => $id, 'x' => $u['users'][$id]];
  });
  if (!empty($res['limited'])) fail('rate_limited', 'Too many new accounts from this connection. Try again in an hour.', 429);
  if (!empty($res['exists'])) fail('exists', 'There is already an account with this e-mail. Sign in instead.', 409);
  login_session($res['id'], $res['x']);
  out(['me' => public_user($res['id'], $res['x'])]);
}
if ($op === 'logout') { $_SESSION = []; session_destroy(); out(['ok' => true]); }

$me = current_user();
if ($op === 'me') {
  if (!$me) out(['me' => null]);
  $u = users(); out(['me' => public_user($me['id'], $u['users'][$me['id']])]);
}
if (!$me) fail('unauthenticated', 'Please sign in again.', 401);
session_write_close(); // release the session file so a student's parallel requests do not queue

function need_admin(array $me): void { if (!$me['admin']) fail('permission_denied', 'Only the course admin can do this.', 403); }

switch ($op) {
  case 'get': {
    $s = segs($req['path'] ?? ''); if (!can_read($s, $me, false)) fail('permission_denied', 'Not allowed.', 403);
    $v = read_doc($s); out(['exists' => $v !== null, 'data' => $v]);
  }
  case 'list': {
    $s = segs($req['path'] ?? ''); if (!can_read($s, $me, true)) fail('permission_denied', 'Not allowed.', 403);
    out(['docs' => read_coll($s)]);
  }
  case 'set': case 'update': {
    $s = segs($req['path'] ?? ''); if (!can_write($s, $me)) fail('permission_denied', 'You cannot change this.', 403);
    $data = $reqObj->data ?? null; if (!is_object($data)) fail('invalid_argument', 'Data must be an object.');
    if (!$me['admin'] && strlen(json_encode($data)) > 512 * 1024) fail('too_large', 'Too much data.', 413);
    $f = doc_file($s);
    with_lock(function () use ($op, $f, $data) {
      if ($op === 'update') { $old = rd($f); if (is_object($old)) { foreach ($data as $k => $v) $old->$k = $v; $data = $old; } }
      wr($f, $data);
    });
    out(['ok' => true]);
  }
  case 'delete': {
    $s = segs($req['path'] ?? ''); if (!can_write($s, $me)) fail('permission_denied', 'You cannot change this.', 403);
    @unlink(doc_file($s)); out(['ok' => true]);
  }
  case 'watch': {
    // returns only what changed since the hashes the page already has, plus who is online
    $items = is_array($req['items'] ?? null) ? array_slice($req['items'], 0, 60) : [];
    $res = [];
    foreach ($items as $it) {
      $k = (string)($it['k'] ?? ''); $coll = ($it['kind'] ?? '') === 'coll';
      $s = segs($it['path'] ?? '');
      if (!can_read($s, $me, $coll)) { $res[$k] = ['error' => 'permission_denied']; continue; }
      $v = $coll ? read_coll($s) : read_doc($s);
      $h = md5(json_encode($v));
      if ($h !== ($it['h'] ?? '')) $res[$k] = ['h' => $h, 'v' => $v];
    }
    $pf = DATA . '/presence/' . $me['id'] . '.json.php';
    $pres = $req['presence'] ?? null;
    $presObj = $reqObj->presence ?? null;
    $old = rd($pf, true);
    if (!is_array($old) || time() - ($old['at'] ?? 0) >= 10 || is_array($pres)) wr($pf, ['at' => time(), 'presence' => is_object($presObj) ? $presObj : (object)($old['presence'] ?? [])]);
    $peers = [];
    foreach (glob(DATA . '/presence/*.json.php') ?: [] as $f) {
      $p = rd($f, true); if (!is_array($p) || time() - ($p['at'] ?? 0) > 25) continue;
      $id = substr(basename($f), 0, -9);
      $peers[] = ['peer' => $id, 'by' => $id, 'isMe' => $id === $me['id'], 'kind' => 'viewer', 'presence' => (object)($p['presence'] ?? [])];
    }
    out(['changes' => (object)$res, 'peers' => $peers]);
  }
  case 'profiles': {
    $u = users(); $out = [];
    foreach (array_slice((array)($req['ids'] ?? []), 0, 500) as $id) { $id = (string)$id; $out[$id] = isset($u['users'][$id]) ? ['id' => $id, 'name' => $u['users'][$id]['name']] : ['id' => $id, 'name' => '']; }
    out(['profiles' => (object)$out]);
  }
  case 'search': {
    need_admin($me); $q = lc(trim((string)($req['q'] ?? ''))); $u = users(); $hits = [];
    foreach ($u['users'] as $id => $x) if (empty($x['admin']) && ($q === '' || strpos(lc($x['name'] . ' ' . $x['username']), $q) !== false)) $hits[] = ['id' => $id, 'name' => $x['name']];
    out(['hits' => array_slice($hits, 0, 20)]);
  }
  case 'changePassword': {
    $old = (string)($req['old'] ?? ''); $new = check_password($req['new'] ?? '');
    $x = with_lock(function () use ($me, $old, $new) {
      $u = users(); $x = $u['users'][$me['id']];
      if (!password_verify($old, $x['hash'])) return null;
      $x['hash'] = password_hash($new, PASSWORD_DEFAULT); $u['users'][$me['id']] = $x; save_users($u); return $x;
    });
    if (!$x) fail('bad_login', 'The current password is not right.', 401);
    session_start(); login_session($me['id'], $x); out(['ok' => true]);
  }
  case 'listUsers': {
    need_admin($me); $u = users(); $list = [];
    foreach ($u['users'] as $id => $x) $list[] = public_user($id, $x);
    out(['users' => $list]);
  }
  case 'createUsers': {
    // one or many: [{name, username, password}]
    need_admin($me);
    $rows = array_slice((array)($req['users'] ?? []), 0, 500);
    if (!$rows) fail('invalid_argument', 'Nothing to create.');
    $clean = [];
    foreach ($rows as $i => $r) $clean[] = ['name' => clean_name($r['name'] ?? ''), 'username' => clean_username($r['username'] ?? ''), 'password' => check_password($r['password'] ?? '')];
    $courses = array_values(array_filter(array_map('strval', (array)($req['courses'] ?? [''])), fn($c) => $c === '' || preg_match('/^[a-z0-9-]{1,40}$/', $c)));
    $made = with_lock(function () use ($clean, $courses) {
      $u = users(); $seen = [];
      foreach ($clean as $r) {
        if (find_username($u, $r['username']) !== null || isset($seen[$r['username']])) fail('exists', 'The username "' . $r['username'] . '" is already taken. Nothing was created.', 409);
        $seen[$r['username']] = true;
      }
      $made = [];
      foreach ($clean as $r) {
        $id = 'u_' . bin2hex(random_bytes(6));
        $u['users'][$id] = ['username' => $r['username'], 'name' => $r['name'], 'hash' => password_hash($r['password'], PASSWORD_DEFAULT), 'created' => time()];
        $made[] = public_user($id, $u['users'][$id]);
      }
      save_users($u);
      foreach ($made as $m) foreach ($courses as $c) wr(doc_file($c === '' ? ['roster', $m['id']] : ['c', $c, 'roster', $m['id']]), ['addedAt' => (int)(microtime(true) * 1000)]);
      return $made;
    });
    out(['users' => $made]);
  }
  case 'enrolSelf': {
    $ns = (string)($req['course'] ?? '');
    if (!in_array($ns, course_namespaces(), true)) fail('invalid_argument', 'No such course.');
    if (!$me['admin'] && !registration_open()) fail('closed', 'Ask the Academy admin to enrol you.', 403);
    enrol($me['id'], $ns); out(['ok' => true]);
  }
  case 'setRegistration': {
    need_admin($me); wr(doc_file(['academy', 'registration']), ['open' => !empty($req['open'])]); out(['open' => registration_open()]);
  }
  case 'updateUser': {
    need_admin($me); $id = (string)($req['id'] ?? '');
    $x = with_lock(function () use ($id, $req) {
      $u = users(); if (!isset($u['users'][$id])) fail('not_found', 'No such account.', 404);
      if (isset($req['name'])) $u['users'][$id]['name'] = clean_name($req['name']);
      if (isset($req['username'])) { $n = clean_username($req['username']); $o = find_username($u, $n); if ($o !== null && $o !== $id) fail('exists', 'That username is already taken.', 409); $u['users'][$id]['username'] = $n; }
      if (isset($req['password'])) $u['users'][$id]['hash'] = password_hash(check_password($req['password']), PASSWORD_DEFAULT);
      if (isset($req['disabled'])) { if (!empty($u['users'][$id]['admin'])) fail('invalid_argument', 'The admin account cannot be paused.'); if ($req['disabled']) $u['users'][$id]['disabled'] = true; else unset($u['users'][$id]['disabled']); }
      save_users($u); return $u['users'][$id];
    });
    out(['user' => public_user($id, $x)]);
  }
  case 'deleteUser': {
    need_admin($me); $id = (string)($req['id'] ?? '');
    if ($id === $me['id']) fail('invalid_argument', 'You cannot delete your own account.');
    with_lock(function () use ($id) { $u = users(); if (!empty($u['users'][$id]['admin'])) fail('invalid_argument', 'The admin account cannot be deleted.'); unset($u['users'][$id]); save_users($u); });
    if (preg_match('/^u_[a-f0-9]+$/', $id)) { @unlink(doc_file(['roster', $id])); foreach (glob(STORE . '/c/*/roster/' . $id . '.json.php') ?: [] as $f) @unlink($f); @unlink(DATA . '/presence/' . $id . '.json.php'); }
    out(['ok' => true]);
  }
  case 'rtc': {
    // video call signalling: who is in the call, and messages between participants
    $rf = rtc_file($req);
    $now = time();
    $res = with_lock(function () use ($rf, $req, $me, $now) {
      $st = rd($rf, true); if (!is_array($st)) $st = ['members' => [], 'kicked' => []];
      foreach ($st['members'] as $id => $m) if ($now - ($m['at'] ?? 0) > 15) unset($st['members'][$id]);
      $kicked = !$me['admin'] && !empty($st['kicked'][$me['id']]);
      if ($kicked || !empty($req['leave'])) unset($st['members'][$me['id']]);
      elseif (!empty($req['join']) || isset($st['members'][$me['id']])) $st['members'][$me['id']] = ['at' => $now, 'mic' => !empty($req['mic']), 'cam' => !empty($req['cam']), 'hand' => !empty($req['hand'])];
      wr($rf, $st);
      $sent = 0;
      if (!$kicked && isset($st['members'][$me['id']])) {
        foreach (array_slice((array)($req['send'] ?? []), 0, 40) as $m) {
          $to = (string)($m['to'] ?? ''); if (!isset($st['members'][$to]) || $to === $me['id']) continue;
          $data = $m['data'] ?? null; if (!is_array($data) || strlen(json_encode($data)) > 65536) continue;
          rtc_push($to, ['from' => $me['id'], 'data' => $data]); $sent++;
        }
      }
      $qf = DATA . '/rtc/q/' . $me['id'] . '.json.php';
      $msgs = rd($qf, true) ?: []; if ($msgs) @unlink($qf);
      return ['st' => $st, 'msgs' => $msgs, 'kicked' => $kicked];
    });
    $u = users(); $members = [];
    foreach ($res['st']['members'] as $id => $m) $members[] = ['id' => $id, 'name' => $u['users'][$id]['name'] ?? '', 'admin' => !empty($u['users'][$id]['admin']), 'mic' => $m['mic'], 'cam' => $m['cam'], 'hand' => !empty($m['hand'])];
    $out = ['members' => $members, 'msgs' => $res['msgs'], 'kicked' => $res['kicked'], 'ice' => ICE_SERVERS];
    if ($me['admin']) $out['removed'] = array_keys(array_filter($res['st']['kicked'] ?? []));
    out($out);
  }
  case 'rtcAdmin': {
    need_admin($me);
    $act = (string)($req['action'] ?? ''); $id = (string)($req['id'] ?? '');
    $rf = rtc_file($req);
    with_lock(function () use ($rf, $act, $id, $me) {
      $st = rd($rf, true); if (!is_array($st)) $st = ['members' => [], 'kicked' => []];
      if ($act === 'mute' && isset($st['members'][$id])) rtc_push($id, ['from' => $me['id'], 'data' => ['type' => 'mute']]);
      if ($act === 'muteAll') foreach (array_keys($st['members']) as $m) if ($m !== $me['id']) rtc_push($m, ['from' => $me['id'], 'data' => ['type' => 'mute']]);
      if ($act === 'kick' && $id !== $me['id']) { $st['kicked'][$id] = true; unset($st['members'][$id]); rtc_push($id, ['from' => $me['id'], 'data' => ['type' => 'kicked']]); }
      if ($act === 'allow') unset($st['kicked'][$id]);
      if ($act === 'reset') $st['kicked'] = [];
      wr($rf, $st);
    });
    out(['ok' => true]);
  }
  default: fail('invalid_argument', 'Unknown operation.');
}
