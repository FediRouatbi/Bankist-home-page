'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  const tryy = section1.getBoundingClientRect();
  console.log(window.pageYOffset);
  //  window.scrollTo(
  //   tryy.left + window.pageXOffset,
  //   tryy.top + window.pageYOffset
  // );
  //   window.scrollTo({
  //   left: tryy.left + window.pageXOffset,
  //   top: tryy.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});

////////////////////////////////////////////////////

//page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     console.log(id);
//   });
// });

// 1.Add eventLister to common parent element
// 2.Determine what elemnt orginated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    //e.target!==e.currentTarget
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
const tabContainer = document.querySelector('.operations__tab-container');
const operationsTab = document.querySelectorAll('.operations__tab');
const opertaionContent = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function (e) {
  //select 1 elemnt
  const clicked = e.target.closest('.operations__tab');
  //if null return(operation bar)
  if (!clicked) return;
  //remove active class from all
  operationsTab.forEach(tab => tab.classList.remove('operations__tab--active'));
  //add active bar for target
  e.target.closest('.operations__tab').classList.add('operations__tab--active');
  //remove content from all
  opertaionContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  //add active class to the content clicked
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//nav
const handHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    e.target.closest('.nav').querySelector('img').style.opacity = this;
    const links = e.target.closest('.nav').querySelectorAll('a');
    links.forEach(elm => {
      if (elm != e.target) elm.style.opacity = this;
    });
  }
};
const nav = document.querySelector('.nav');

nav.addEventListener('mouseover', handHover.bind(0.5));
nav.addEventListener('mouseout', handHover.bind(1));
// const section1Rect = section1.getBoundingClientRect();
// window.addEventListener('scroll', function (e) {
//   if (window.pageYOffset > section1Rect.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
//function for the observeur
// const obsCallback = function (entries, observer) {
//   console.log(entries, observer);
// };
// options for the observeur
// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };
//creating the observeur
// const observeur = new IntersectionObserver(obsCallback, obsOptions);
//calling the observeur
// observeur.observe(section1);

const header = document.querySelector('.header');

const navBound = nav.getBoundingClientRect().height;

const headerObserveur = function (entry) {
  const [enty] = entry;
  if (!enty.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const options = {
  root: null,
  threshold: 0,
  rootMargin: `${-navBound}px`,
};

const observeur = new IntersectionObserver(headerObserveur, options);

observeur.observe(header);

///////////////////////////////

const sectionsObserveur = function (entries, observer) {
  const [entr] = entries;
  if (!entr.isIntersecting) return;
  entr.target.classList.remove('section--hidden');
  observAllSections.unobserve(entr.target);
};
const sections = document.querySelectorAll('section');
const observAllSections = new IntersectionObserver(sectionsObserveur, {
  root: null,
  threshold: 0.15,
});
sections.forEach(sect => {
  sect.classList.add('section--hidden');
  observAllSections.observe(sect);
});
//lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const img = function (entries) {
  const [entr] = entries;
  if (!entr.isIntersecting) return;
  //replacing src with data-crc
  entr.target.src = entr.target.dataset.src;
  // make image stay blur into it load
  entr.target.addEventListener('load', function () {
    entr.target.classList.remove('lazy-img');
  });

  imgObserv.unobserve(entr.target);
};

const imgObserv = new IntersectionObserver(img, {
  root: null,
  threshold: 0.9,
  rootMargin: '200px',
});

imgTargets.forEach(elem => imgObserv.observe(elem));

//////////////////////////    SLIDER

const slider = function () {
  const slides = document.querySelectorAll('.slide');

  const btnRight = document.querySelector('.slider__btn--right');

  const btnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');
  const dots = document.querySelector('.dots');

  // translate slides
  // put slid selected on screen translateX(0)
  const cur = function (current) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - current)}%)`)
    );
  };
  //move slide right and left
  const mouveSlide = function () {
    if (this === 'right') {
      if (current === slides.length - 1) current = 0;
      else current++;
      cur(current);
      colorDots(current);
    } else if (this === 'left') {
      if (current === 0) current = slides.length - 1;
      else current--;
      cur(current);
      colorDots(current);
    }
  };
  //create dots
  const creatDots = function () {
    slides.forEach((_, i) => {
      dots.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  //color thet selected dot
  function colorDots(dotNum) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });

    document
      .querySelector(`.dots__dot[data-slide="${dotNum}"]`)
      .classList.add('dots__dot--active');
  }

  ////////////////////////////////////////////////
  let current = 0;
  cur(current); // intialisation of slide [0,100,200,300]
  creatDots();
  colorDots(current);

  btnRight.addEventListener('click', mouveSlide.bind('right'));

  btnLeft.addEventListener('click', mouveSlide.bind('left'));
  document.addEventListener('keydown', function (e) {
    //.bind return a function we need to call it
    e.key === 'ArrowRight' && mouveSlide.bind('right')();
    e.key === 'ArrowLeft' && mouveSlide.bind('left')();
  });
  dots.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      e.target.dataset; //an object
      current = Number(e.target.dataset.slide); // was a bug here cauz current become a string 🧐
      cur(current);
      colorDots(current);
    }
  });
};

slider();

//  document.getElementById('section--1');

// const allButton = document.getElementsByTagName('button');
// console.log(allButton);

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML =
//   'we focusn in everything <button class="btn">waw</button></div>';
// const header = document.querySelector('.header');
// header.append(message);
// header.prepend(message);
// header.append(message.cloneNode(true));
// header.before(message);
// header.after(message)

// document
//   .querySelector('.btn')
//   .addEventListener('click', () => message.remove());
// message.parentElement;
// console.log(message.parentElement);
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';
// console.log(getComputedStyle(message).height);
// document.documentElement.style.setProperty('--color-primary', 'orangered');
// const logo = document.querySelector('.nav__logo');
// console.log(logo.className);
// containerMovements.insertAdjacentHTML('afterbegin', html);

// const randomInt = (min, max) =>
//   Math.round(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target, e.currentTarget);
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target, e.currentTarget);
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(e.target, e.currentTarget);
// });
// const h1 = document.querySelector('h1');
// //going downwards : child

// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'blue';
// // going upwards : parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// h1.closest();
// [...h1.parentElement.children].forEach(function (elem) {
//   if (elem != h1) elem.style.transform = 'scale(0.5)';
// });
