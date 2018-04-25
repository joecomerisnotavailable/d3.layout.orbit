An example of [d3.layout.orbit](https://github.com/emeeks/d3.layout.orbit) that shows the different modes:

**"flat"** is the default, demonstrated in earlier [examples that use flare.json](http://bl.ocks.org/emeeks/298e07ea67a640b5d9f4).

**"solar"** arranges each satellite in its own ring, equally divided from the set size of the layout.

**"atomic"** places 2 satellites in orbit in the first ring and 8 in every ring after that.

**"custom"** is achieved by passing an array of integers. Each integer sets the number of satellites in that ring, with the final value used to set the number of satellites in all remaining rings. Under the hood, "solar" could be achieved by passing [1], "atomic" could be achieved by passing [2,8] and "flat" could be achieved by passing [9999].