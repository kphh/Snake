(function(root) {
  var Project = root.Project = (root.Project || {});

  var View = Project.View = function(el) {
    this.$el = el;
    this.board = null; // This will be set in #start
  };

  _.extend(View.prototype, {
    step: function() {
      this.board.snake.move();
      this.$el.html(this.board.render());
    },

    start: function() {
      // Construct board
      this.board = new Project.Board(15,15);

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

      window.setInterval(function() { self.step(); }, 500);
    }
  });
})(this);