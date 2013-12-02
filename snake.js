(function(root) {
  var Project = root.Project = (root.Project || {});

  // var _ = require("./underscore");

  var Coord = Project.Coord = function(x, y) {
    this.x = x;
    this.y = y;
  };

  _.extend(Coord.prototype, {
    plus: function(dir) {
      var x = this.x;
      var y = this.y;

      if (dir === "N") {
        y -= 1;
      } else if (dir === "E") {
        x += 1;
      } else if (dir === "S") {
        y += 1;
      } else if (dir === "W") {
        x -= 1;
      }

      return new Coord(x, y);
    }
  });



  var Snake = Project.Snake = function(startCoord) {
    this.dir = "N";
    this.segments = [startCoord];
    this.growthCounter = 0;
    this.score = 0;
  };

  _.extend(Snake.prototype, {
    move: function() {
      // Create new head off of old one
      this.segments.unshift(this.segments[0].plus(this.dir));
      // Remove tail
      if (this.growthCounter <= 0) {
        this.segments.pop();
      }
      else {
        this.growthCounter -= 1;
      }
    },

    turn: function(dir) {
      this.dir = dir;
    },

    head: function() {
      return this.segments[0];
    },

    grow: function() {
      this.growthCounter = 3;
      this.score += 10;
    }
  });



  var Board = Project.Board = function(width, height, maxApples) {
    this.width = width;
    this.height = height;
    this.maxApples = maxApples;

    var startCoord = new Coord(Math.floor(width/2),
                               Math.floor(height/2));
    this.snake = new Snake(startCoord);

    this.apples = [];
    this.generateApples(maxApples);
  }

  _.extend(Board.prototype, {
    // might generate apples under snake
    generateApples: function(numApples) {
      for (var i = 0; i < numApples; i++) {
        var x = Math.floor(Math.random()*this.width);
        var y = Math.floor(Math.random()*this.height);
        this.apples.push(new Coord(x,y));
      }
    },

    render: function() {
      // Render board to ASCII art

      // Set entire board to empty
      var rows = new Array(this.height);
      for (var r = 0; r < this.height; r++) {
        rows[r] = new Array(this.width);
        for (var c = 0; c < this.width; c++) {
          rows[r][c] = ".";
        }
      }

      // Change display character of apples
      this.apples.forEach(function(coord) {
        rows[coord.y][coord.x] = 'a';
      });

      // Change display character of snake segments
      this.snake.segments.forEach(function(coord) {
        rows[coord.y][coord.x] = 'S';
      });

      var displayString = "";
      for (var r = 0; r < this.height; r++) {
        displayString += rows[r].join("") + "\n";
      }

      return displayString;
    },

    checkCollisions: function() {
      var head = this.snake.head();
      if (head.x < 0 || head.x >= this.width) {
        return true;
      }

      if (head.y < 0 || head.y >= this.height) {
        return true;
      }

      for (var i = 1; i < this.snake.segments.length; i++) {
        var coord = this.snake.segments[i];
        if (coord.x === head.x && coord.y === head.y) {
          return true;
        }
      }

      return false;
    },

    checkEating: function() {
      var head = this.snake.head();

      for (var i = this.apples.length-1; i >= 0; i--) {
        var coord = this.apples[i];

        if (coord.x === head.x && coord.y === head.y) {
          this.snake.grow();

          // delete apple
          this.apples.splice(i, 1);
        }
      };
    },

    checkApples: function() {
      // check number of apples
      // if less than max
      // there is a chance a new one appears this turn

      if (this.apples.length < this.maxApples) {
        var num = Math.floor(Math.random()*10); // 1 in 10 chance
        if (num === 0) {
          this.generateApples(1);
        }
      }
    }
  });

})(this);

// var board = new this.Project.Board(9,9);
// console.log(board.render());
// console.log(board.snake.segments);