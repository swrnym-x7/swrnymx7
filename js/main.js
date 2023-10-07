

(function($) {

	"use strict";

   $(window).load(function() {
	
    	$("#loader").fadeOut("slow", function(){


        $("#preloader").delay(300).fadeOut("slow");

      });       

  	})
	  const coords = { x: 0, y: 0 };
	  const circles = document.querySelectorAll(".circle");
	  
	  const colors = [
		"#ffb56b",
		"#fdaf69",
		"#f89d63",
		"#f59761",
		"#ef865e",
		"#ec805d",
		"#e36e5c",
		"#df685c",
		"#d5585c",
		"#d1525c",
		"#c5415d",
		"#c03b5d",
		"#b22c5e",
		"#ac265e",
		"#9c155f",
		"#950f5f",
		"#830060",
		"#7c0060",
		"#680060",
		"#60005f",
		"#48005f",
		"#3d005e"
	  ];

	  
	  circles.forEach(function (circle, index) {
		circle.x = 0;
		circle.y = 0;
		circle.style.backgroundColor = colors[index % colors.length];
	  });
	  
	  window.addEventListener("mousemove", function(e){
		coords.x = e.clientX;
		coords.y = e.clientY;
		
	  });
	  
	  function animateCircles() {
		
		let x = coords.x;
		let y = coords.y;
		
		circles.forEach(function (circle, index) {
		  circle.style.left = x - 12 + "px";
		  circle.style.top = y - 12 + "px";
		  
		  circle.style.scale = (circles.length - index) / circles.length;
		  
		  circle.x = x;
		  circle.y = y;
	  
		  const nextCircle = circles[index + 1] || circles[0];
		  x += (nextCircle.x - x) * 0.3;
		  y += (nextCircle.y - y) * 0.3;
		});
	   
		requestAnimationFrame(animateCircles);
	  }
	  
	  animateCircles();

  	setTimeout(function() {

   	$('#intro h1').fitText(1, { minFontSize: '42px', maxFontSize: '84px' });

  	}, 100);

  	$(".fluid-video-wrapper").fitVids();

	$("#owl-slider").owlCarousel({
        navigation: false,
        pagination: true,
        itemsCustom : [
	        [0, 1],
	        [700, 2],
	        [960, 3]
	     ],
        navigationText: false
    });

	$('.alert-box').on('click', '.close', function() {
	  $(this).parent().fadeOut(500);
	});	

   var statSection = $("#stats"),
       stats = $(".stat-count");

   statSection.waypoint({

   	handler: function(direction) {

      	if (direction === "down") {       		

			   stats.each(function () {
				   var $this = $(this);

				   $({ Counter: 0 }).animate({ Counter: $this.text() }, {
				   	duration: 4000,
				   	easing: 'swing',
				   	step: function (curValue) {
				      	$this.text(Math.ceil(curValue));
				    	}
				  	});
				});

       	} 

       	this.destroy();      	

		},
			
		offset: "90%"
	
	});	

	var containerProjects = $('#folio-wrapper');

	containerProjects.imagesLoaded( function() {

		containerProjects.masonry( {		  
		  	itemSelector: '.folio-item',
		  	resize: true 
		});

	});


   $('.item-wrap a').magnificPopup({

      type:'inline',
      fixedContentPos: false,
      removalDelay: 300,
      showCloseBtn: false,
      mainClass: 'mfp-fade'

   });

   $(document).on('click', '.popup-modal-dismiss', function (e) {
   	e.preventDefault();
   	$.magnificPopup.close();
   });


   var toggleButton = $('.menu-toggle'),
       nav = $('.main-navigation');

   // toggle button
   toggleButton.on('click', function(e) {

		e.preventDefault();
		toggleButton.toggleClass('is-clicked');
		nav.slideToggle();

	});

  	nav.find('li a').on("click", function() {   

   	// update the toggle button 		
   	toggleButton.toggleClass('is-clicked'); 
   	// fadeout the navigation panel
   	nav.fadeOut();   		
   	     
  	});


	var sections = $("section"),
	navigation_links = $("#main-nav-wrap li a");	

	sections.waypoint( {

       handler: function(direction) {

		   var active_section;

			active_section = $('section#' + this.element.id);

			if (direction === "up") active_section = active_section.prev();

			var active_link = $('#main-nav-wrap a[href="#' + active_section.attr("id") + '"]');			

         navigation_links.parent().removeClass("current");
			active_link.parent().addClass("current");

		}, 

		offset: '25%'
	});


  	$('.smoothscroll').on('click', function (e) {
	 	
	 	e.preventDefault();

   	var target = this.hash,
    	$target = $(target);

    	$('html, body').stop().animate({
       	'scrollTop': $target.offset().top
      }, 800, 'swing', function () {
      	window.location.hash = target;
      });

  	});  
  

	$('input, textarea, select').placeholder()  



	$('#contactForm').validate({

		/* submit via ajax */
		ubmitHandler: function(form) {

			var sLoader = $('#submit-loader');

			$.ajax({      	

		      type: "POST",
		      url: "inc/sendEmail.php",
		      data: $(form).serialize(),
		      beforeSend: function() { 

		      	sLoader.fadeIn(); 

		      },
		      success: function(msg) {

	            if (msg == 'OK') {
	            	sLoader.fadeOut(); 
	               $('#message-warning').hide();
	               $('#contactForm').fadeOut();
	               $('#message-success').fadeIn();   
	            }
	            // There was an error
	            else {
	            	sLoader.fadeOut(); 
	               $('#message-warning').html(msg);
		            $('#message-warning').fadeIn();
	            }

		      },
		      error: function() {

		      	sLoader.fadeOut(); 
		      	$('#message-warning').html("Something went wrong. Please try again.");
		         $('#message-warning').fadeIn();

		      }

	      });     		
  		}

	});


	var pxShow = 300; // height on which the button will show
	var fadeInTime = 400; // how slow/fast you want the button to show
	var fadeOutTime = 400; // how slow/fast you want the button to hide
	var scrollSpeed = 300; // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'


	jQuery(window).scroll(function() {

		if (!( $("#header-search").hasClass('is-visible'))) {

			if (jQuery(window).scrollTop() >= pxShow) {
				jQuery("#go-top").fadeIn(fadeInTime);
			} else {
				jQuery("#go-top").fadeOut(fadeOutTime);
			}

		}		

	});		

})(jQuery);
