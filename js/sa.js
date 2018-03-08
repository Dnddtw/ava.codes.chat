$(document).ready(function() {
	var	$chat = $('.chat-window'),
		$messagesContainer = $('.messages-container'),
		userPhotoURL = $('#my-photo').attr('src'),
		irPhotoURL;

	// Скролл при перезавантеженні сторінки.
	// Чат для активного друга.

	var $tabsCollection = $('.chat-tab'),
		activeUser = '0';

	(function() {
		var height = $messagesContainer.height();

		if (height > 519) {
			$messagesContainer[0].scrollTo(0, $(this).height());
		}
	})();

	function messagesContainerActive(user) {
		return $('.messages-container').removeClass('active').filter('.user' + user).addClass('active');
	}

	// Sidebar
	$tabsCollection.on('click', function() {
		// Вибір чату зі списку друзів.
		var $this = $(this);
		irPhotoURL = $this.children('.user-img').attr('src');
		activeUser = $this.index() + 1,
		historyFlag = false;

		// Для активного друга, якщо перезавантажити сторінку.
		localStorage.setItem('user', activeUser);


		if ($chat.find('.user' + activeUser).length == 0) {
			$chat.prepend('<div class="messages-container user' + activeUser + '"></div>');
			historyFlag = true;
		}

		$messagesContainer = messagesContainerActive(activeUser);

		// Виводимо історію.
		var userHistory = localStorage.getItem('user' + activeUser);
		if (historyFlag && userHistory) {
			var tempArray = JSON.parse(userHistory);

			for (var i = 0; i < tempArray.length; i++) {
				var imgURL = userPhotoURL;

				if (tempArray[i].side == 'ir-message') {
					imgURL = irPhotoURL;
				}

				$messagesContainer.prepend('<div class="message ' + tempArray[i].side + '"><div class="message-text">' + tempArray[i].text + '</div><img src="' + imgURL + '" alt="" class="message-img"></div>');
			}
		}

		postSidebar();
		$messagesContainer.children('.ir-message').find('.message-img').attr('src', irPhotoURL);
		$tabsCollection.removeClass('active');
		$this.addClass('active');
	});

	(function() {
		// Обираємо активного друга зі списку.
		var lsUser = localStorage.getItem('user');
		if (lsUser) {
			$tabsCollection.filter('.user' + lsUser).click();
		} else {
			$tabsCollection.first().click();
		}
	})();

	$('.search').on('input', function() {
		// Фільтр пошуку друзів.
		var $this = $(this),
			RegExpValue = RegExp($this.val(), 'i');

		$tabsCollection.show().filter(function() {
			var $this = $(this);

			if (!RegExpValue.test($this.children('.user-name').text()))
				return true;
		}).hide();
	});


	//Message window
	var $messageButton = $('.message-button'),
		$messageField = $('.message-field');

	$messageButton.on('click', function() {
		if (!$messageField.val()) {
			return;
		}

		// Додаємо повідомлення користувача
		$messagesContainer.prepend('<div class="message user-message"><div class="message-text">' + $messageField.val() + '</div><img src="' + userPhotoURL + '" alt="" class="message-img"></div>');

		updateChat(activeUser, true);
		$messageField.val('');

		setTimeout(function() {
			$messagesContainer.prepend('<div class="message ir-message"><div class="message-text">' + messagesArray[getRandomPhrase()] + '</div><img src="' + irPhotoURL + '" alt="" class="message-img"></div>');
			updateChat(activeUser, false);
		}, 1500);
	});

	function getRandomPhrase() {
		return Math.round(0 + Math.random() * (messagesArray.length - 1));
	};

	$messageField.on('keypress', function(event) {
		if (event.keyCode == 13) {
			$messageButton.click();
		}
	});


	// Запиc історіх повідомлень в localStorage.
	function updateChat(user, isUserMessage) {
		var $this = $(this),
			user = 'user' + user,
			side = isUserMessage ? 'user-message' : 'ir-message',
			text = $('.messages-container.active').children().first().text(),
			tempArray = [];

		var message = {
			text: text,
			side: side
		};

		var history = localStorage.getItem(user);

		if (history) {
			tempArray = JSON.parse(history);
		} 

		tempArray.push(message);
		localStorage.setItem(user, JSON.stringify(tempArray));
	}

	var $navButton = $('.nav-button'),
		$sidebar = $('.chat-sidebar');

	$navButton.on('click', postSidebar);
	$chat.on('click', function() {
		if ($sidebar.hasClass('open')) {
			postSidebar();
		}
	});



	function postSidebar() {
		$('.nav-button, .chat-sidebar').toggleClass('open');
	}
});