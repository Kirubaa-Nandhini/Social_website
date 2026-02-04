(function(){
  var jquery_version = '3.4.1';
  var site_url = 'http://127.0.0.1:8000/';
  var static_url = site_url + 'static/';
  var min_width = 100;
  var min_height = 100;

  function bookmarklet() {
    // 1️⃣ Load CSS
    var css = jQuery('<link>');
    css.attr({
      rel: 'stylesheet',
      type: 'text/css',
      href: static_url + 'css/bookmarklet.css?r=' + Math.floor(Math.random()*99999999999999999999)
    });
    jQuery('head').append(css);

    // 2️⃣ Add popup HTML
    var box_html = `
      <div id="bookmarklet">
        <a href="#" id="close">&times;</a>
        <h1>Select an image to bookmark:</h1>
        <div class="images"></div>
      </div>`;
    jQuery('body').append(box_html);

    // 3️⃣ Close button
    jQuery('#bookmarklet #close').click(function(e){
      e.preventDefault();
      jQuery('#bookmarklet').remove();
    });

    // 4️⃣ Find and display images (.jpg, .jpeg, .png)
    jQuery.each(jQuery('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]'), function(index, image) {
      if (jQuery(image).width() >= min_width && jQuery(image).height() >= min_height) {
        var image_url = jQuery(image).attr('src');
        jQuery('#bookmarklet .images').append('<a href="#"><img src="'+image_url+'" /></a>');
      }
    });

    // 5️⃣ Click event for dynamically added images (delegation)
    jQuery('#bookmarklet .images').on('click', 'a', function(e){
      e.preventDefault();
      var selected_image = jQuery(this).children('img').attr('src');

      // hide popup
      jQuery('#bookmarklet').hide();

      // open new window to submit the image to Django
      window.open(
        site_url +'images/create/?url=' + encodeURIComponent(selected_image)
        + '&title=' + encodeURIComponent(jQuery('title').text()),
        '_blank'
      );
    });
  }

  // 6️⃣ Check if jQuery is loaded
  if (typeof window.jQuery != 'undefined') {
    bookmarklet();
  } else {
    // Load jQuery from Google CDN
    var script = document.createElement('script');
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/' + jquery_version + '/jquery.min.js';
    document.head.appendChild(script);

    // Wait until jQuery is loaded
    var attempts = 15;
    function waitForJQuery() {
      if (typeof window.jQuery == 'undefined') {
        if (--attempts > 0) {
          setTimeout(waitForJQuery, 250);
        } else {
          alert('An error occurred while loading jQuery');
        }
      } else {
        bookmarklet();
      }
    }
    waitForJQuery();
  }
})();
