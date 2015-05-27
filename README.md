# Throttle CLI

`throttle` is a command line interface to throttle stdin to stdout.

It can be for example used to view logs like this:

    # Shows a line every 300ms max (default)
    tail -f | throttle

    # Show 10 lines per second max
    tail -f | throttle --milliseconds 100
    # Same as
    tail -f | throttle -m 100

throttle will keep lines that come from stdin and didn't go out to stdout in a queue. By default the length of the queue is 1000.

You can change that value:

    tail -f | throttle --max-queue 10

You can also disable the queue totally (in that case throttle will drop events that are not passed to stdout)

I use that option with inotifywait quite often to have a watcher that doesn't trigger duplicate events or very near events:


    inotifywait -m -r . | throttle --queue 0

# Installation

clone the repository

    npm install -g .
