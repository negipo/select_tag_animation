jQuery(function($) {
  var CHAR_PX_SIZE, DEFAULT_TEXT, audio, canvas, charData, context, draw, drawChars, loadAudio, match, playAudio, prepareChars, text;
  DEFAULT_TEXT = 'セレクトタグでアニメーション';
  CHAR_PX_SIZE = 20;
  match = location.href.match(/\?text=(.*)$/);
  if (match) {
    text = decodeURI(match[1]);
  } else {
    text = DEFAULT_TEXT;
  }
  $('#text_input').val(text);
  canvas = $('#canvas')[0];
  context = canvas.getContext('2d');
  charData = [];
  audio = T('audio', 'tick.mp3,ogg');
  loadAudio = function() {
    return audio.load();
  };
  playAudio = function() {
    return audio.clone().play().onended = function() {
      return this.pause();
    };
  };
  loadAudio();
  drawChars = function() {
    context.font = "" + CHAR_PX_SIZE + "px Arial Bold";
    return context.fillText(text, 0, CHAR_PX_SIZE - 2);
  };
  prepareChars = function() {
    var charImageData, fill, i, singleCharData, textIndex, textLength, _ref, _ref2, _results;
    drawChars();
    textLength = text.length;
    _results = [];
    for (textIndex = 0, _ref = textLength - 1; 0 <= _ref ? textIndex <= _ref : textIndex >= _ref; 0 <= _ref ? textIndex++ : textIndex--) {
      singleCharData = [];
      charImageData = context.getImageData(textIndex * CHAR_PX_SIZE, 0, CHAR_PX_SIZE, CHAR_PX_SIZE).data;
      for (i = 0, _ref2 = Math.pow(CHAR_PX_SIZE, 2) - 1; 0 <= _ref2 ? i <= _ref2 : i >= _ref2; 0 <= _ref2 ? i++ : i--) {
        if (charImageData[(i * 4) + 3] !== 0) {
          fill = '1';
        } else {
          fill = '0';
        }
        singleCharData.push(fill);
      }
      _results.push(charData.push(singleCharData));
    }
    return _results;
  };
  prepareChars();
  draw = function() {
    var i, idx, select, selects, wrapper, _ref;
    wrapper = $('#inner');
    selects = [];
    for (i = 0, _ref = Math.pow(CHAR_PX_SIZE, 2) - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
      select = $('<select />').attr({
        id: select
      }).appendTo(wrapper);
      $('<option />').val('0').text(' ').attr({
        id: "option_" + i + "_0"
      }).appendTo(select);
      $('<option />').val('1').text('█').attr({
        id: "option_" + i + "_1"
      }).appendTo(select);
      selects.push(select);
      if (i % CHAR_PX_SIZE === CHAR_PX_SIZE - 1) {
        $('<div />').addClass('clear').appendTo(wrapper);
      }
    }
    idx = -1;
    return setInterval(function() {
      var singleCharData;
      idx += 1;
      if (idx === text.length) {
        idx = 0;
      }
      singleCharData = charData[idx];
      return singleCharData.forEach(function(fill, idx) {
        var option;
        option = $("#option_" + idx + "_" + fill);
        if (!option.attr('selected')) {
          return setTimeout(function() {
            option.attr({
              selected: true
            });
            return playAudio();
          }, Math.random() * 600);
        }
      });
    }, 3000);
  };
  return draw();
});