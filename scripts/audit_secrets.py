"""Check every Git commit for common credentials and forbidden paths."""
import re
import subprocess

revisions = subprocess.check_output(['git', 'rev-list', '--all'], text=True).splitlines()
patterns = [
    re.compile(rb'gh[opusr]_[A-Za-z0-9]{20,}'),
    re.compile(rb'mongodb\+srv://[^\s:]+:[^\s@]+@'),
    re.compile(rb'-----BEGIN [A-Z ]*PRIVATE KEY-----'),
    re.compile(rb'JWT_SECRET=(?!replace-with)[^\s]{32,}'),
]
findings = []
for revision in revisions:
    tree = subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', revision], text=True).splitlines()
    for path in tree:
        if path == '.env' or path.endswith('/.env') or 'node_modules/' in path:
            findings.append(f'{revision[:7]}: forbidden path {path}')
            continue
        if path.endswith(('.png', '.jpg', '.pdf', '.lock')):
            continue
        content = subprocess.check_output(['git', 'show', f'{revision}:{path}'])
        for pattern in patterns:
            if pattern.search(content):
                findings.append(f'{revision[:7]}: possible secret in {path}')

print(f'Audited {len(revisions)} commits; {len(findings)} findings')
for finding in sorted(set(findings)):
    print(finding)
raise SystemExit(bool(findings))
