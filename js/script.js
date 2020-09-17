const switcher = document.querySelector('#cbx'),
	more = document.querySelector('.more'),
	modal = document.querySelector('.modal'),
	videos = document.querySelectorAll('.videos__item'),
	searchInput = document.querySelector('.search'),
	videosWrapper = document.querySelector('.videos__wrapper');
let player,
	night = false;

const bindSlideToggle = (trigger, boxBody, content, openClass) => {
	let button = {
		'element': document.querySelector(trigger),
		'active': false,
	};
	const box = document.querySelector(boxBody),
		boxContent = document.querySelector(content);

	button.element.addEventListener('click', () => {
		if (button.active === false) {
			button.active = true;
			box.style.height = boxContent.clientHeight + 'px';
			box.classList.add(openClass);
		}
		else {
			button.active = false;
			box.style.height = 0 + 'px';
			box.classList.remove(openClass);
		}
	});
};
bindSlideToggle('.hamburger', '[data-slide="nav"]', '.header__menu', 'slide-active');


const switchMode = () => {

	if (night === false) {
		night = true;
		document.body.classList.add('night');
		document.querySelectorAll('.hamburger > line').forEach(elem => elem.style.stroke = '#fff');
		document.querySelectorAll('.videos__item-descr').forEach(elem => elem.style.color = '#fff');
		document.querySelectorAll('.videos__item-views').forEach(elem => elem.style.color = '#fff');
		document.querySelector('.header__item-descr').style.color = '#fff';
		document.querySelector('.logo > img').src = 'logo/youtube_night.svg';
		document.querySelector('hr').style.display = 'none';
		document.querySelector('header').style.cssText = `
				border-bottom: 1px solid rgba(255, 255, 255, .2);
				margin-bottom: 30px;
		`;
	}
	else {
		night = false;
		document.body.classList.remove('night');
		document.querySelectorAll('.hamburger > line').forEach(elem => elem.style.stroke = '#000');
		document.querySelectorAll('.videos__item-descr').forEach(elem => elem.style.color = '#000');
		document.querySelectorAll('.videos__item-views').forEach(elem => elem.style.color = '#000');
		document.querySelector('.header__item-descr').style.color = '#000';
		document.querySelector('.logo > img').src = 'logo/youtube.svg';
		document.querySelector('header').style.cssText = `
				border-bottom: none;
				margin-bottom: 0;
		`;
		document.querySelector('hr').style.display = 'block';
	}
};

// const data = [
// 	['img/thumb_5.webp', 'img/thumb_4.webp', 'img/thumb_3.webp'],
// 	['#1 Верстка на flexbox CSS | Блок преимущества и галерея | Марафон верстки | Артем Исламов', '#2 Установка spikmi и работа с ветками на Github | Марафон вёрстки Урок 2', '#3 Верстка реального заказа landing Page | Марафон вёрстки | Артём Исламов'],
// 	['28 тыс. просмотров', '4,2 тыс. просмотров', '3,6 тыс. просмотров'],
// 	['mC8JW_aG2EM', '7BvHoh0BrMw', 'X9SmcY3lM-U']
// ];

// const addVideos = () => {
// 	const videosWrapper = document.querySelector('.videos__wrapper');
// 	more.remove();

// 	for (let i = 0; i < data[0].length; i++) {
// 		let card = document.createElement('a');
// 		card.classList.add('videos__item', 'videos__item-active');
// 		card.setAttribute('data-url', data[3][i]);
// 		card.innerHTML = `
// 			<img src="${data[0][i]}" alt="thumb">
// 			<div class="videos__item-descr">
// 			${data[1][i]}
// 			</div>
// 			<div class="videos__item-views">
// 			${data[2][i]}
// 			</div>
// 		`;
// 		videosWrapper.append(card);
// 		setTimeout(() => {
// 			card.classList.remove('videos__item-active');
// 		}, 0);
// 		if(night===true) {
// 			card.querySelector('.videos__item-descr').style.color='#fff';
// 			card.querySelector('.videos__item-views').style.color='#fff';
// 		}
// 		bindNewModal(card);
// 	}
// 	sliceTitle('.videos__item-descr', 80);
// };

const load = () => {
	gapi.client.init({
		'apiKey': 'AIzaSyAR24GIBpGtCKczQTkzdNBsdAFYJmY4JTk',
		'discoveryDocs': ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"],
	})
		.then(() => {
			return gapi.client.youtube.playlistItems.list({
				"part": [
					"snippet,contentDetails"
				],
				"maxResults": '6',
				"playlistId": "PL3LQJkGQtzc4gsrFkm4MjWhTXhopsMgpv"
			});
		})
		.then(response => {
			response.result.items.forEach(item => {
				let card = document.createElement('a');

				card.classList.add('videos__item', 'videos__item-active');
				card.setAttribute('data-url', item.contentDetails.videoId);
				card.innerHTML = `
							<img src="${item.snippet.thumbnails.high.url}" alt="thumb">
							<div class="videos__item-descr">
							${item.snippet.title}
							</div>
							<div class="videos__item-views">
							2.7 тыс. просмотров
							</div>
						`;
				videosWrapper.append(card);
				setTimeout(() => {
					card.classList.remove('videos__item-active');
				}, 0);
				if (night === true) {
					card.querySelector('.videos__item-descr').style.color = '#fff';
					card.querySelector('.videos__item-views').style.color = '#fff';
				}
			});

			sliceTitle('.videos__item-descr', 90);
			bindModal(document.querySelectorAll('.videos__item'));
		})
		.catch(err => {
			console.log(err);
		});
};

const addVideos = () => {
	more.remove();
	gapi.load('client', load);
};


const searchItem = target => {
	gapi.client.init({
		'apiKey': 'AIzaSyAR24GIBpGtCKczQTkzdNBsdAFYJmY4JTk',
		'discoveryDocs': ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"],
	})
		.then(() => {
			return gapi.client.youtube.search.list({
				'maxResults': '9',
				'part': 'snippet',
				'q': `${target}`,
				'type': ''
			});
		})
		.then(response => {
			videosWrapper.textContent = '';
			response.result.items.forEach(item => {
				let card = document.createElement('a');

				card.classList.add('videos__item', 'videos__item-active');
				card.setAttribute('data-url', item.id.videoId);
				card.innerHTML = `
							<img src="${item.snippet.thumbnails.high.url}" alt="thumb">
							<div class="videos__item-descr">
							${item.snippet.title}
							</div>
							<div class="videos__item-views">
							2.7 тыс. просмотров
							</div>
						`;
				videosWrapper.append(card);
				setTimeout(() => {
					card.classList.remove('videos__item-active');
				}, 0);
				if (night === true) {
					card.querySelector('.videos__item-descr').style.color = '#fff';
					card.querySelector('.videos__item-views').style.color = '#fff';
				}
			});

			sliceTitle('.videos__item-descr', 90);
			bindModal(document.querySelectorAll('.videos__item'));
		})
};

const search = event => {
	event.preventDefault();
	gapi.load('client', () => { searchItem(document.querySelector('.search > input').value) });
// 	document.querySelector('.search > input').value = '';
};

const sliceTitle = (selector, count) => {
	document.querySelectorAll(selector).forEach(elem => {
		elem.textContent.trim();
		if (elem.textContent.length > count) {
			const str = elem.textContent.slice(0, count + 1) + '...';
			elem.textContent = str;
		}
	});
};
sliceTitle('.videos__item-descr', 80);

const openModal = () => {
	modal.style.display = 'block';
};

const closeModal = event => {
	const target = event.target;
	if (!target.closest('.modal__body')) {
		modal.style.display = 'none';
		player.stopVideo();
	}

};

const bindModal = (cards) => {
	cards.forEach(card => {
		card.addEventListener('click', event => {
			event.preventDefault();
			const id = card.getAttribute('data-url');
			loadVideo(id);
			openModal();
		});
	});
};

const createVideo = () => {
	const tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
	const firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	setTimeout(() => {
		player = new YT.Player('frame', {
			height: '100%',
			width: '100%',
			videoId: 'M7lc1UVf-VE'
		});
	}, 190);
};
createVideo();

const loadVideo = id => {
	player.loadVideoById({ 'videoId': `${id}` });
};



switcher.addEventListener('change', switchMode);
more.addEventListener('click', addVideos);
modal.addEventListener('click', closeModal);
searchInput.addEventListener('submit', search);
