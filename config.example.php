<?php
// Stakeholder Academy settings.
// The admin account is "admin". Its first password is set here as a one-way hash (never as text).
// After the first sign-in you can change it from the website: menu > Change password.
const ADMIN_NAME = 'Course admin';
const ADMIN_INITIAL_HASH = 'REPLACE_WITH_YOUR_PASSWORD_HASH';
// How long a sign-in lasts, in days.
const SESSION_DAYS = 14;
// Video call: servers that help browsers find each other. STUN is enough on most networks.
// If some participants cannot see or hear each other (strict company firewalls), add a TURN server here, e.g.
// ['urls' => 'turn:turn.example.com:3478', 'username' => 'user', 'credential' => 'secret'],
const ICE_SERVERS = [
  ['urls' => ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302']],
];
// Public home page: anyone can create an account and is enrolled in the courses they choose (no e-mail confirmation).
// The admin can also open or close registration from the website (People and enrolment). This is only the starting value.
const REGISTRATION_OPEN = true;
// Courses on this server (filled in automatically when the package is built).
const COURSE_NAMESPACES = ['', 's2c'];

