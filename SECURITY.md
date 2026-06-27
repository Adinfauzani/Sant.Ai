# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.x     | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Sant.AI seriously. If you believe you have found a
security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, report them via email:

**security@santai.dev**

You should receive a response within 48 hours. If you do not hear back, follow
up via email to ensure we received your message.

## What to Include

- Type of vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix (if known)

## Scope

Sant.AI is a student project collaboration platform. The following are in scope:

- Authentication and authorization bypass
- Data exposure or leakage
- Injection vulnerabilities (XSS, SQLi, etc.)
- Privilege escalation
- CSRF, SSRF, and other server-side issues

## Out of Scope

- Rate limiting issues on non-sensitive endpoints
- Missing security headers that do not result in exploitation
- Social engineering attacks
- Physical attacks
- Issues in third-party dependencies that are already patched upstream

## Disclosure

We follow a 90-day disclosure window. We ask that you allow us 90 days to
address the issue before publicly disclosing it.

## Recognition

We maintain a security acknowledgments page to recognize researchers who
responsibly disclose vulnerabilities. If you would like to be credited, please
include your preferred name and affiliation in your report.
