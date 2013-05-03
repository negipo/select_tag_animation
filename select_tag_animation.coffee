jQuery(($) ->
  DEFAULT_TEXT = 'セレクトタグでアニメーション'
  CHAR_PX_SIZE = 20

  # educe text from url
  match = location.href.match(/\?text=(.*)$/)
  if match
    text = decodeURI(match[1])
  else
    text = DEFAULT_TEXT

  $('#text_input').val(text)

  canvas = $('#canvas')[0]
  context = canvas.getContext('2d')
  charData = []

  # load ausio
  audio = T('audio', 'tick.mp3,ogg')
  loadAudio = ->
    audio.load()

  playAudio = ->
    audio.clone().play().onended = -> @pause()

  loadAudio()

  # get text pixel data from canvas
  drawChars = ->
    context.font = "#{CHAR_PX_SIZE}px Arial Bold"
    context.fillText(text, 0, CHAR_PX_SIZE - 2)

  prepareChars = ->
    drawChars()
    textLength = text.length

    for textIndex in [0..textLength - 1]
      singleCharData = []
      charImageData = context.getImageData(textIndex * CHAR_PX_SIZE, 0, CHAR_PX_SIZE, CHAR_PX_SIZE).data
      for i in [0 .. Math.pow(CHAR_PX_SIZE, 2) - 1]
        if charImageData[(i * 4) + 3] != 0
          fill = '1'
        else
          fill = '0'
        singleCharData.push(fill)

      charData.push(singleCharData)

  prepareChars()

  # draw char into select tags
  draw = ->
    wrapper = $('#inner')

    selects = []
    for i in [0 .. Math.pow(CHAR_PX_SIZE, 2) - 1]
      select = $('<select />').attr(id: select).appendTo(wrapper)
      $('<option />').val('0').text(' ').attr(id: "option_#{i}_0").appendTo(select)
      $('<option />').val('1').text('█').attr(id: "option_#{i}_1").appendTo(select)
      selects.push(select)

      if i % CHAR_PX_SIZE == CHAR_PX_SIZE - 1
        $('<div />').addClass('clear').appendTo(wrapper)

    idx = -1
    setInterval( ->
      idx += 1
      if idx == text.length
        idx = 0
      singleCharData = charData[idx]
      singleCharData.forEach((fill, idx) ->
        option = $("#option_#{idx}_#{fill}")
        unless option.attr('selected')
          setTimeout( ->
            option.attr(selected: true)
            playAudio()
          , Math.random() * 600)
      )

    , 3000)
  draw()
)
