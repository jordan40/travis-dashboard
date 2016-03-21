# Travis Dashboard
Creates a dashboard of a user/orgs repos to see whats passing and failing at a glance on Travis CI.

[![Licence](https://img.shields.io/badge/Licence-ISC-blue.svg)](https://opensource.org/licenses/ISC) [![Code Climate](https://codeclimate.com/github/stevenharradine/travis-dashboard/badges/gpa.svg)](https://codeclimate.com/github/stevenharradine/travis-dashboard) [![Issue Count](https://codeclimate.com/github/stevenharradine/travis-dashboard/badges/issue_count.svg)](https://codeclimate.com/github/stevenharradine/travis-dashboard)

## Usage
### update config.js
`GITHUB_TOKEN` - your github token with access to read repositories

### run
```
node generate-travis-dashboard.js {{ organization_name }} > index.html
```

### open results in index.html
```
firefox index.html
```
