$(function() {

    /**
     * FILTER left Column
     */
        var select = $('.ul-select');
        select.on('click', 'a', function(e) {
            e.preventDefault();
            var selectUL = $(this).closest(".filter-select");
            var selectValue = selectUL.find('.valueItem');
            var selectSpan = selectUL.find('span');

            selectUL.toggleClass('close');

            selectValue.val($(this).attr("href"));
            selectUL.find('.li.select').removeClass('select');
            $(this).parent().addClass('select');
            selectSpan.html($(this).attr("alt"));

        });
        select.on('click', 'span',function() {
            $(this).parent().toggleClass("close");
            //$(this).next().removeClass('hidden');
            $('.scroll-pane').jScrollPane({showArrows: true});
        });

        $('.scroll-pane').jScrollPane({showArrows: true});

	(function() {
		$('#slider-result').each(function() {
			var $this = $(this),
				$range_l = $('[data-min]', $this),
				$range_r = $('[data-max]', $this),
				min = $range_l.attr('data-min') * 1,
				max = $range_r.attr('data-max') * 1,
				current_l = $range_l.val(),
				current_r = $range_r.val(),
				$slider;

			if (!max) return true;

			if (!current_l || current_l == 0) {
				current_l = min;
				$range_l.val(min);
			}
			if (!current_r || current_r == 0) {
				current_r = max;
				$range_r.val(max);
			}

			$slider = $('#slider-price');
			$slider = $slider.slider({
				range: true,
				min: min,
				max: max,
				values: [current_l, current_r],
				slide: function(event, ui) {
					$range_l.val(ui.values[0]);
					$range_r.val(ui.values[1]);
				},
				stop: function() {
					$range_l.trigger('change');
				}
			});

			function changeRange() {
				$slider.slider('values', [$range_l.val(), $range_r.val()]);
			}

			$range_l.on('change', changeRange);
			$range_r.on('change', changeRange);
		});
	})();

    /**
     * FILTER ALFAVIT
     */

    $('#filter-catalog_alfavit').on('click', 'a', function(e){
        e.preventDefault();

        if($(this).hasClass('selected_no'))
            return false;

        $(this).toggleClass("selected");

        var arr = [];
        $('#filter-catalog_alfavit a.selected').each( function(){
            arr.push($(this).attr('id'));
        });

        var alfavit = $('.list-alfavit');

        if (arr.length > 0) {
            alfavit.children("a, b").each(function () {
                $(this).addClass('litera_hidden');
            });
        }
        else {
            alfavit.children("a, b").each(function () {
                $(this).removeClass('litera_hidden');
            });
        }

        $.each(arr, function(index) {
            if(arr[index] === 'pop' || arr[index] === 'rare') {
                var itemAlt = arr[index];
                $('.' + itemAlt).removeClass('litera_hidden');

                alfavit.children("a."+itemAlt).each(function () {
                    $('b.'+$(this).attr('alt')).removeClass('litera_hidden');
                });
            }
            else {
                var itemAlt = $('.list-alfavit').find('a.'+arr[index]).attr('alt');
                $('.' + itemAlt).removeClass('litera_hidden');
            }
        });

        return false;
    });

    /**
     * LINK show block
     */
    $('.slide-area').on('click', '.show', function(e) {
        e.preventDefault();
        $(this).closest('.slide-area').toggleClass('showAll');
    });

    /**
     * FAQ show block
     */
    $('#faq-list').on('click', 'a.faq-item', function(e) {
        e.preventDefault();
        $(this).closest('article').toggleClass('showAll');
        $(this).find('span.icon-arrow').addClass('yellow');
    });

    /**
     * CATALOG MENU
     */
     var menu = $('.menu-catalog');
        menu.on('mouseover', 'li.root', function(e){
            e.preventDefault();
            menu.find('li.open').removeClass('open');
            $(this).toggleClass('open');
        });
        menu.on('mouseout', 'li.root', function(e){
            e.preventDefault();
            menu.find('li.open').removeClass('open');
        });

	$('#filter-catalog select').each(function() {
		var $select = $(this),
			title = $select.attr('data-title');

		$(this).mfs({
			'dropdownHandle': '',
			'multipleTitle': 'выбрано',
			'mutlipleTitleNone' : title,
			'enableScroll' : true,
			'maxHeight'    : 255
		});
	});


	$(function(){
		var $line = $('.line-top'),
			$header = $('#header'),
			$nav = $('#fixed-nav'),
			lineHeight = $line.outerHeight(),
			navTop = lineHeight + $header.outerHeight(),
			$content = $('#content'),
			$filter = $content.find('.col-right .inner');

		if (!$('#bx-panel').size()) {
			$content.css('margin-top', $nav.outerHeight());
			$nav.addClass('fixed');

			window.UpdateNavHeight = function() {
				$content
					.css('margin-top', $nav.outerHeight())
					.css('min-height', $filter.outerHeight() + 'px');
			};

			window.ScrollNav = function() {
				var top = $(window).scrollTop(),
					lineHeight1 = lineHeight + $nav.outerHeight() + 40,
					navTop1 = navTop + $nav.outerHeight() + 40;

				if (top + lineHeight < navTop) {
					$nav.css('top', navTop - top);
				} else {
					$nav.css('top', lineHeight);
				}

				if (top + lineHeight1 < navTop1) {
					$filter.css('top', navTop1 - top);
				} else {
					$filter.css('top', lineHeight1);
				}
			};

			window.CheckFilter = function() {
				if ($content.outerHeight() >= $filter.outerHeight()) {
					$filter.parent().addClass('fixed');
				} else {
					$filter.parent().removeClass('fixed');
				}
			};

			UpdateNavHeight();
			CheckFilter();
			ScrollNav();

			$(window)
				.scroll(ScrollNav);
		} else {
			window.UpdateNavHeight = function() {};
			window.ScrollNav = function() {};
			window.CheckFilter = function() {};
		}
	});

    /**
     * Product height
     * для бесконечного скрола код находится в шаблоне компанента
     */
	window.setHeight = function() {
		$('.row_height').each(function () {
			var newHeight = $(this).height();
			var newHeight_next = $(this).next();
			var newHeight_next2 = $(this).next().next();

			if (newHeight_next.height() > newHeight)
				newHeight = newHeight_next.height();

			if (newHeight_next2.height() > newHeight)
				newHeight = newHeight_next2.height();

			$(this).css('height', newHeight);
			newHeight_next.css('height', newHeight);
			newHeight_next2.css('height', newHeight);
		});
	};

    window.setHeight();
});
