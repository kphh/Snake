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
        console.log(this.board.height);
        this.$el.append("<div class='row'></div>");
        for(var c = 0; c < this.board.width; c++) {
          $("div.row:last").append("<div class='cell' id='" + r + "x" + c +"'></div>");
        };
      };
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


    },

    start: function() {
      // Construct board
      this.board = new Project.Board(15,15,5);

      // Build DOM
      this.buildDOM();

      // Initial render
      this.render();

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
          }
        });
      });

      this.intervalID = window.setInterval(function() { self.step(); }, 333);
    }
  });
})(this);