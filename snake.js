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
  };

  _.extend(Snake.prototype, {
    move: function() {
      // Create new head off of old one
      this.segments.unshift(this.segments[0].plus(this.dir));
      // Remove tail
      this.segments.pop();
    },

    turn: function(dir) {
      this.dir = dir;
    }
  });



  var Board = Project.Board = function(width, height) {
    this.width = width;
    this.height = height;

    var startCoord = new Coord(Math.floor(width/2),
                               Math.floor(height/2));
    this.snake = new Snake(startCoord);
  }

  _.extend(Board.prototype, {
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

      // Change display character of snake segments
      this.snake.segments.forEach(function(coord) {
        rows[coord.y][coord.x] = 's';
      });

      var displayString = "";
      for (var r = 0; r < this.height; r++) {
        displayString += rows[r].join("") + "\n";
      }

      return displayString;
    }
  });

})(this);

// var board = new this.Project.Board(9,9);
// console.log(board.render());
// console.log(board.snake.segments);