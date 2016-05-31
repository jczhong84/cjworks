var marked = require('marked');
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

var str = " \
##### Problem \n\
> iMac cannot wake up after long sleep (actually it's hibernate). \n\
 \n\
##### Cause \n\
> It's related with Parallel Desktop. \n\
> It occurs when parallel desktop is on while entering hibernate. \n\
 \n\
##### Fix \n\
> Quit the App when entering to sleep. \n\
 \n\
> Leverage an application called *sleepwatcher* \n\
 \n\
 \n\
1. Install sleepwatcher \n\
``` bash \n\
$ brew install sleepwatcher \n\
``` \n\
 \n\
2. Launch sleepwatcher at login: \n\
``` bash \n\
  ln -sfv /usr/local/opt/sleepwatcher/*.plist ~/Library/LaunchAgents \n\
``` \n\
 \n\
3. Load sleepwatcher now: \n\
``` bash \n\
  launchctl load ~/Library/LaunchAgents/de.bernhard-baehr.sleepwatcher-20compatibility-localuser.plist \n\
``` \n\
 \n\
4. Create +x ~/.sleep file, with content: \n\
``` bash \n\
  osascript -e 'quit app \n\"Parallels Desktop.app\"'                                                        \
``` "

console.log(marked(str));
