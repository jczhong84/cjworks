---
title: How to quit an application on Mac's sleep
date: 2016-04-06 21:07:01
tags:
- mac
---

##### Problem
> iMac cannot wake up after long sleep (actually it's hibernate).

##### Cause
> It's related with Parallel Desktop.
> It occurs when parallel desktop is on while entering hibernate.

##### Fix
> Quit the App when entering to sleep.

> Leverage an application called *sleepwatcher*


1. Install sleepwatcher
``` bash
$ brew install sleepwatcher
```

2. Launch sleepwatcher at login:
``` bash
  ln -sfv /usr/local/opt/sleepwatcher/*.plist ~/Library/LaunchAgents
```

3. Load sleepwatcher now:
``` bash
  launchctl load ~/Library/LaunchAgents/de.bernhard-baehr.sleepwatcher-20compatibility-localuser.plist
```

4. Create +x ~/.sleep file, with content:
``` bash
  osascript -e 'quit app "Parallels Desktop.app"'                                                       
```
