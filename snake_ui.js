(function(root) {
  var Project = root.Project = (root.Project || {});

  var View = Project.View = function(el) {
    this.$el = el;
    this.board = null; // This will be set in #start
  };

  _.extend(View.prototype, {
    step: function() {
      this.board.snake.move();

      this.board.checkEating();
      this.board.checkApples();

      if (this.board.checkCollisions()) {
        clearInterval(this.intervalID);
        alert("You're dead!");
      } else {
        //this.$el.html(this.board.render());
        this.render();
      }
    },

    buildDOM: function() {
      for(var r = 0; r < this.board.height; r++) {
        this.$el.append("<div class='row'></div>");

        for(var c = 0; c < this.board.width; c++) {
          $("div.row:last").append("<div class='cell' id='" + r + "x" + c +"'></div>");
        };
      };

      this.$el.append("<div id='scorebox'></div>");
      this.$el.append("<div id='pausebox'></div>");
    },

    render: function() {
      $('div.cell').removeClass('snake');
      $('div.cell').removeClass('apple');

      var apples = this.board.apples;

      for (var i=0; i<apples.length; i++) {
        var coord = apples[i];
        var id = coord.y.toString() + "x" + coord.x.toString();

        $('#'+id).addClass('apple');
      }

      var segments = this.board.snake.segments;

      for (var i=0; i<segments.length; i++) {
        var coord = segments[i];
        var id = coord.y.toString() + "x" + coord.x.toString();

        $('#'+id).removeClass('apple');
        $('#'+id).addClass('snake');
      }

      $('#scorebox').html("Score: "+this.board.snake.score);
    },

    bindKeys: function() {
      // Bind key events
      var self = this;
      $(document).ready(function() {
        $(document).on("keydown", function(event) {
          switch(event.which) {
          case 37: // left
            event.preventDefault();
            self.board.snake.turn("W");
            break;
          case 38: // up
            event.preventDefault();
            self.board.snake.turn("N");
            break;
          case 39: // right
            event.preventDefault();
            self.board.snake.turn("E");
            break;
          case 40: // down
            event.preventDefault();
            self.board.snake.turn("S");
            break;
          case 80: // P
            event.preventDefault();
            if (self.paused) {
              self.intervalID = window.setInterval(function() { self.step(); }, 200);
              self.paused = false;
              $("#pausebox").html(" ");
            }
            else {
              clearInterval(self.intervalID);
              self.paused = true;
              $("#pausebox").html("PAUSED");
            }
            break;
          };
        });
      });
    },

    start: function() {
      // Construct board
      this.board = new Project.Board(20,20,5);

      // Build DOM
      this.buildDOM();

      // Initial render
      this.render();

      // Setup Pause
      this.paused = false;

      // Bind key events
      this.bindKeys();

      // Start timer
      var self = this;
      this.intervalID = window.setInterval(function() { self.step(); }, 200);
    }
  });
})(this);