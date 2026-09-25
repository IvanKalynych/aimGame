const startGameBtn = document.querySelector('#start');
const screens = document.querySelectorAll('.screen');
const parentTimeBth = document.querySelector('#timeList');
const board = document.querySelector('.board')
let timeEl = document.querySelector('#time');
let time = 0;
let score = 0;

startGameBtn.addEventListener('click', (e)=>{
	e.preventDefault();
	screens[0].classList.add('up');
});
parentTimeBth.addEventListener('click', (e)=>{
	if(e.target.classList.contains('time-btn')){
		time = +e.target.getAttribute('data-time');
		startGame();		
	};
})


const startGame = (e)=> {
	screens[1].classList.add('up');
	timeEl.innerHTML = `00:${time}`;
	Interval()
}

const Interval = ()=>{
	intervalLL = setInterval((e)=>{
		--time;
		timeEl.innerHTML = `00:${time}`;
		if(time<10){
		timeEl.innerHTML = `00:0${time}`;
		}
		if(time <1){
			clearInterval(intervalLL);
			finishGame();
		}
	},1000)
};

const createCircle = ()=>{
	const div = document.createElement('div');
	let {width, height} = board.getBoundingClientRect();
	let randomNumber = createRandomeNumber(10,64);
	let x = createRandomeNumber(0, width-randomNumber);
	let y = createRandomeNumber(0, height-randomNumber);

	div.classList.add('circle');
	div.style.width = `${randomNumber}px`;
	div.style.height = `${randomNumber}px`;
	div.style.top = `${y}px`;
	div.style.left = `${x}px`;
	board.appendChild(div);

	div.addEventListener('click', (e)=>{
		if(div.classList.contains('hit')) return;
		div.classList.add('hit');
		score++;
		explodeCircle(x + randomNumber/2, y + randomNumber/2, randomNumber);
		div.addEventListener('animationend', ()=> div.remove(), {once: true});
		createCircle();
	})

};

const PARTICLE_COLORS = ['#16D9E3', '#30C7EC', '#46AEF7', '#ffffff'];

const explodeCircle = (cx, cy, size)=>{
	// ударна хвиля
	const ring = document.createElement('div');
	ring.classList.add('ring');
	ring.style.width = `${size}px`;
	ring.style.height = `${size}px`;
	ring.style.left = `${cx - size/2}px`;
	ring.style.top = `${cy - size/2}px`;
	board.appendChild(ring);
	ring.addEventListener('animationend', ()=> ring.remove(), {once: true});

	// уламки
	const count = 10 + Math.round(size / 6);
	for(let i = 0; i < count; i++){
		const particle = document.createElement('div');
		const particleSize = createRandomeNumber(4, size / 4 + 4);
		const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
		const distance = createRandomeNumber(size * 0.6, size * 1.6 + 30);

		particle.classList.add('particle');
		particle.style.width = `${particleSize}px`;
		particle.style.height = `${particleSize}px`;
		particle.style.left = `${cx - particleSize/2}px`;
		particle.style.top = `${cy - particleSize/2}px`;
		particle.style.background = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
		board.appendChild(particle);

		const dx = Math.cos(angle) * distance;
		const dy = Math.sin(angle) * distance;
		particle.animate([
			{transform: 'translate(0, 0) scale(1)', opacity: 1},
			{transform: `translate(${dx}px, ${dy + 20}px) scale(0)`, opacity: 0}
		], {
			duration: createRandomeNumber(450, 750),
			easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
			fill: 'forwards'
		}).onfinish = ()=> particle.remove();
	}

	// +1
	const text = document.createElement('div');
	text.classList.add('score-pop');
	text.textContent = '+1';
	text.style.left = `${cx}px`;
	text.style.top = `${cy}px`;
	board.appendChild(text);
	text.addEventListener('animationend', ()=> text.remove(), {once: true});
};

const createRandomeNumber = (min, max)=>{
	return Math.round(Math.random()*(max-min)+min)
}
createCircle();


const finishGame = ()=>{
	board.remove();
	document.querySelector('h3').innerHTML = `Ваш счет: ${score}`;
};