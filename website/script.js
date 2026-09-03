const IMG_DATA = {
	rockstar: "images/RIDESH 2 GRAPHICS 1.png",
	swapnil: "images/Swapnil shadows.png",
	manipulation: "images/Manipulation.png",
	lookoflove: "images/look of love red.png",
	reflections: "images/khaikho.jpg",
	eye: "images/Eye stretched.png",
	one: "images/one.jpg",
	two: "images/two.jpg",
	three: "images/three.jpg",
	four: "images/four.jpg",
	five: "images/five.jpg",
	six: "images/six.jpg",
	seven: "images/seven.jpg",
	tattoo: "images/Tattoo.png",
};
document.querySelectorAll("img[data-key]").forEach(img => {
	img.src = IMG_DATA[img.dataset.key];
});

const io = new IntersectionObserver(
	entries => {
		entries.forEach(e => {
			if (e.isIntersecting) e.target.classList.add("in");
		});
	},
	{ threshold: 0.15 },
);
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

const cursor = document.querySelector(".custom-cursor");

// Smooth mouse movement tracking
window.addEventListener("mousemove", e => {
	cursor.style.top = `${e.clientY}px`;
	cursor.style.left = `${e.clientX}px`;
});

// Expand square frame on hovering over clickable elements
const clickables = document.querySelectorAll(
	'a, button, input, [role="button"]',
);

clickables.forEach(el => {
	el.addEventListener("mouseenter", () => cursor.classList.add("active"));
	el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
});
/* Selected Work: infinite centered carousel with depth blur */
(function () {
	const carousel = document.getElementById("workList");
	if (!carousel) return;

	let cards = Array.from(carousel.querySelectorAll(".work-item"));
	const prev = document.querySelector(".carousel-nav.prev");
	const next = document.querySelector(".carousel-nav.next");
	if (!cards.length) return;

	// Clone the last and first cards so the carousel is never empty at either edge.
	const firstClone = cards[0].cloneNode(true);
	const lastClone = cards[cards.length - 1].cloneNode(true);
	firstClone.classList.add("carousel-clone");
	lastClone.classList.add("carousel-clone");
	carousel.insertBefore(lastClone, cards[0]);
	carousel.appendChild(firstClone);
	cards = Array.from(carousel.querySelectorAll(".work-item"));

	const realCount = cards.length - 2;
	let activeIndex = 1;
	let raf = null;
	let correcting = false;

	function updateDepth() {
		raf = null;
		const center = carousel.scrollLeft + carousel.clientWidth / 2;

		cards.forEach((card, index) => {
			const cardCenter = card.offsetLeft + card.offsetWidth / 2;
			const distance = Math.abs(center - cardCenter);
			const maxDistance = carousel.clientWidth * 0.78;
			const ratio = Math.min(distance / maxDistance, 1);

			card.classList.toggle(
				"is-active",
				distance < card.offsetWidth * 0.28,
			);
			card.classList.toggle(
				"is-near",
				distance >= card.offsetWidth * 0.28 &&
					distance < card.offsetWidth * 0.95,
			);
			card.style.setProperty("--distance", ratio.toFixed(3));

			if (distance < card.offsetWidth * 0.28) activeIndex = index;
		});
	}

	function requestDepthUpdate() {
		if (!raf) raf = requestAnimationFrame(updateDepth);
	}

	function centerCard(card, smooth = true) {
		const targetLeft =
			card.offsetLeft - (carousel.clientWidth - card.offsetWidth) / 2;

		carousel.scrollTo({
			left: targetLeft,
			behavior: smooth ? "smooth" : "auto",
		});
	}

	function goTo(index) {
		if (correcting) return;
		activeIndex = Math.max(0, Math.min(index, cards.length - 1));
		centerCard(cards[activeIndex], true);
	}

	function correctInfiniteEdge() {
		if (correcting) return;

		if (activeIndex === 0) {
			correcting = true;
			requestAnimationFrame(() => {
				activeIndex = realCount;
				centerCard(cards[realCount], false);
				requestDepthUpdate();
				correcting = false;
			});
		} else if (activeIndex === cards.length - 1) {
			correcting = true;
			requestAnimationFrame(() => {
				activeIndex = 1;
				centerCard(cards[1], false);
				requestDepthUpdate();
				correcting = false;
			});
		}
	}

	carousel.addEventListener(
		"scroll",
		() => {
			requestDepthUpdate();
			clearTimeout(carousel._snapTimer);
			carousel._snapTimer = setTimeout(correctInfiniteEdge, 140);
		},
		{ passive: true },
	);

	window.addEventListener("resize", requestDepthUpdate);
	prev?.addEventListener("click", () => goTo(activeIndex - 1));
	next?.addEventListener("click", () => goTo(activeIndex + 1));

	carousel.addEventListener("keydown", e => {
		if (e.key === "ArrowLeft") {
			e.preventDefault();
			goTo(activeIndex - 1);
		}
		if (e.key === "ArrowRight") {
			e.preventDefault();
			goTo(activeIndex + 1);
		}
	});

	// Do NOT hijack the mouse wheel: normal vertical page scrolling remains available.
	// Shift + wheel can still be used by browsers/trackpads for horizontal scrolling.

	// Drag with mouse on desktop.
	let dragging = false;
	let dragStartX = 0;
	let dragStartScroll = 0;

	carousel.addEventListener("pointerdown", e => {
		if (e.pointerType === "mouse" && e.button !== 0) return;
		dragging = true;
		dragStartX = e.clientX;
		dragStartScroll = carousel.scrollLeft;
		carousel.setPointerCapture?.(e.pointerId);
		carousel.classList.add("is-dragging");
	});

	carousel.addEventListener("pointermove", e => {
		if (!dragging) return;
		carousel.scrollLeft = dragStartScroll - (e.clientX - dragStartX);
	});

	function stopDrag() {
		dragging = false;
		carousel.classList.remove("is-dragging");
	}

	carousel.addEventListener("pointerup", stopDrag);
	carousel.addEventListener("pointercancel", stopDrag);
	carousel.addEventListener("lostpointercapture", stopDrag);

	// Start with the first real artwork centered and the LAST artwork visible on its left.
	requestDepthUpdate();
	setTimeout(() => {
		activeIndex = 1;
		centerCard(cards[1], false);
		requestDepthUpdate();
	}, 80);
})();

const canvas = document.getElementById("net");
const ctx = canvas.getContext("2d");
let w, h, points;
function resize() {
	w = canvas.width = canvas.offsetWidth;
	h = canvas.height = canvas.offsetHeight;
}
function initPoints() {
	const count = Math.floor((w * h) / 26000);
	points = Array.from({ length: count }, () => ({
		x: Math.random() * w,
		y: Math.random() * h,
		vx: (Math.random() - 0.5) * 0.3,
		vy: (Math.random() - 0.5) * 0.3,
	}));
}
function tick() {
	ctx.clearRect(0, 0, w, h);
	points.forEach(p => {
		p.x += p.vx;
		p.y += p.vy;
		if (p.x < 0 || p.x > w) p.vx *= -1;
		if (p.y < 0 || p.y > h) p.vy *= -1;
	});
	for (let i = 0; i < points.length; i++) {
		for (let j = i + 1; j < points.length; j++) {
			const dx = points[i].x - points[j].x,
				dy = points[i].y - points[j].y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < 140) {
				ctx.strokeStyle = `rgba(217,149,74,${(1 - dist / 140) * 0.35})`;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(points[i].x, points[i].y);
				ctx.lineTo(points[j].x, points[j].y);
				ctx.stroke();
			}
		}
		ctx.fillStyle = "rgba(241,239,233,.55)";
		ctx.beginPath();
		ctx.arc(points[i].x, points[i].y, 1.6, 0, Math.PI * 2);
		ctx.fill();
	}
	requestAnimationFrame(tick);
}
window.addEventListener("resize", () => {
	resize();
	initPoints();
});
resize();
initPoints();
tick();

// Circular orbit of photos in the hero
(function () {
	const orbit = document.getElementById("orbit");
	if (!orbit) return;
	const items = Array.from(orbit.querySelectorAll(".orbit-item"));
	let angle = 0;
	let targetTiltX = 0,
		targetTiltY = 0,
		tiltX = 0,
		tiltY = 0;

	window.addEventListener("mousemove", e => {
		const nx = (e.clientX / window.innerWidth) * 2 - 1;
		const ny = (e.clientY / window.innerHeight) * 2 - 1;
		targetTiltY = nx * 18;
		targetTiltX = -ny * 12;
	});

	let hovering = null;
	items.forEach(item => {
		item.addEventListener("mouseenter", () => (hovering = item));
		item.addEventListener("mouseleave", () => {
			if (hovering === item) hovering = null;
		});
	});

	function tickOrbit() {
		const rect = orbit.getBoundingClientRect();
		const radiusX = rect.width * 0.42;
		const radiusY = rect.height * 0.32;
		tiltX += (targetTiltX - tiltX) * 0.05;
		tiltY += (targetTiltY - tiltY) * 0.05;

		angle += 0.0016;
		items.forEach((item, i) => {
			if (item === hovering) return; // let CSS hover scale take over, skip repositioning this frame
			const a = angle + (i / items.length) * Math.PI * 2;
			const x = Math.cos(a) * radiusX;
			const y = Math.sin(a) * radiusY;
			const depthScale = 0.75 + ((Math.sin(a) + 1) / 2) * 0.4; // items toward viewer read larger
			const z = Math.sin(a);
			item.style.transform = `translate(${x + tiltY}px, ${y + tiltX}px) scale(${depthScale})`;
			item.style.zIndex = Math.round((z + 1) * 10);
			item.style.opacity = 0.55 + ((z + 1) / 2) * 0.45;
		});
		requestAnimationFrame(tickOrbit);
	}
	tickOrbit();
})();
/* =========================================
   CINEMATIC PAGE LOADER
   ========================================= */

(function () {
	const loader = document.getElementById("pageLoader");
	const percent = document.getElementById("loaderPercent");

	if (!loader || !percent) return;

	if ("scrollRestoration" in history) {
		history.scrollRestoration = "manual";
	}

	window.scrollTo(0, 0);

	const duration = 2600; // total loading time
	const startTime = performance.now();

	function animateLoader(currentTime) {
		const elapsed = currentTime - startTime;

		// 0 → 1
		const linearProgress = Math.min(elapsed / duration, 1);

		// Ease-in: very slow at first, increasingly fast near 100%
		const easedProgress = Math.pow(linearProgress, 5);

		const value = Math.floor(easedProgress * 100);

		percent.textContent = `${value}%`;

		if (linearProgress < 1) {
			requestAnimationFrame(animateLoader);
		} else {
			percent.textContent = "100%";

			// Brief pause at 100%
			setTimeout(() => {
				loader.classList.add("is-hidden");

				window.scrollTo(0, 0);

				setTimeout(() => {
					loader.remove();
				}, 1300);
			}, 350);
		}
	}

	requestAnimationFrame(animateLoader);
})();
/* =========================================
   MOBILE ONE-CARD-AT-A-TIME CAROUSEL
   ========================================= */

(function () {
	const carousel = document.querySelector(".work-grid");

	if (!carousel) return;

	let startX = 0;
	let startY = 0;

	carousel.addEventListener(
		"touchstart",
		e => {
			if (window.innerWidth > 600) return;

			startX = e.touches[0].clientX;
			startY = e.touches[0].clientY;
		},
		{ passive: true },
	);

	carousel.addEventListener(
		"touchend",
		e => {
			if (window.innerWidth > 600) return;

			const endX = e.changedTouches[0].clientX;
			const endY = e.changedTouches[0].clientY;

			const deltaX = endX - startX;
			const deltaY = endY - startY;

			/*
			 * IMPORTANT:
			 * If the movement is mainly vertical,
			 * do absolutely nothing.
			 * This lets the page scroll normally.
			 */
			if (Math.abs(deltaY) >= Math.abs(deltaX)) {
				return;
			}

			// Ignore very small horizontal movements
			if (Math.abs(deltaX) < 20) {
				return;
			}

			const cards = [...carousel.querySelectorAll(".work-item")];

			if (!cards.length) return;

			const currentScroll = carousel.scrollLeft;

			let currentIndex = 0;
			let closestDistance = Infinity;

			cards.forEach((card, index) => {
				const cardCenter = card.offsetLeft + card.offsetWidth / 2;

				const carouselCenter = currentScroll + carousel.clientWidth / 2;

				const distance = Math.abs(cardCenter - carouselCenter);

				if (distance < closestDistance) {
					closestDistance = distance;
					currentIndex = index;
				}
			});

			let nextIndex;

			if (deltaX < 0) {
				nextIndex = Math.min(currentIndex + 1, cards.length - 1);
			} else {
				nextIndex = Math.max(currentIndex - 1, 0);
			}

			const target = cards[nextIndex];

			const targetScroll =
				target.offsetLeft -
				(carousel.clientWidth - target.offsetWidth) / 2;

			carousel.scrollTo({
				left: targetScroll,
				behavior: "smooth",
			});
		},
		{ passive: true },
	);
})();
/* =========================================
   SELECTED WORK — ENDLESS HORIZONTAL LOOP
   ========================================= */

const workGrid = document.querySelector(".work-grid");

if (workGrid) {
	const items = [...workGrid.children];

	// Create two additional sets
	items.forEach(item => {
		workGrid.appendChild(item.cloneNode(true));
	});

	items.forEach(item => {
		workGrid.appendChild(item.cloneNode(true));
	});

	let setWidth = workGrid.scrollWidth / 3;

	// Start from the middle set
	workGrid.scrollLeft = setWidth;

	workGrid.addEventListener("scroll", () => {
		const left = workGrid.scrollLeft;

		// Moving forward
		if (left >= setWidth * 2) {
			workGrid.scrollLeft = left - setWidth;
		}

		// Moving backward
		else if (left <= 0) {
			workGrid.scrollLeft = left + setWidth;
		}
	});

	window.addEventListener("resize", () => {
		setWidth = workGrid.scrollWidth / 3;
	});
}
document.addEventListener("DOMContentLoaded", () => {
	const timeline = document.querySelector(".ec-timeline");
	const glowBar = document.querySelector(".glow-bar");

	if (!timeline || !glowBar) return;

	const updateGlow = () => {
		const rect = timeline.getBoundingClientRect();
		const windowHeight = window.innerHeight;

		// Calculate scroll percentage through the timeline container
		let progress = (windowHeight / 1.5 - rect.top) / rect.height;
		progress = Math.min(Math.max(progress, 0), 1); // Clamp between 0% and 100%

		glowBar.style.setProperty("--scroll-height", `${progress * 100}%`);
	};

	window.addEventListener("scroll", updateGlow);
	window.addEventListener("resize", updateGlow);
	updateGlow(); // Initial trigger on load
});

document.addEventListener("DOMContentLoaded", () => {
	const dot = document.querySelector(".cursor-dot");
	const trail = document.querySelector(".cursor-trail");

	if (!dot || !trail) return;

	let mouseX = 0;
	let mouseY = 0;
	let trailX = 0;
	let trailY = 0;

	window.addEventListener("mousemove", e => {
		mouseX = e.clientX;
		mouseY = e.clientY;

		dot.style.left = `${mouseX}px`;
		dot.style.top = `${mouseY}px`;
	});

	function animateTrail() {
		trailX += (mouseX - trailX) * 0.15;
		trailY += (mouseY - trailY) * 0.15;

		trail.style.left = `${trailX}px`;
		trail.style.top = `${trailY}px`;

		requestAnimationFrame(animateTrail);
	}
	animateTrail();

	// Event Delegation for hover state
	document.addEventListener("mouseover", e => {
		if (
			e.target.closest(
				'a, button, input, select, textarea, [role="button"]',
			)
		) {
			trail.classList.add("active");
			dot.classList.add("active");
		}
	});

	document.addEventListener("mouseout", e => {
		if (
			e.target.closest(
				'a, button, input, select, textarea, [role="button"]',
			)
		) {
			trail.classList.remove("active");
			dot.classList.remove("active");
		}
	});
});
document.addEventListener("DOMContentLoaded", () => {
	const dot = document.querySelector(".cursor-dot");
	const trail = document.querySelector(".cursor-trail");

	if (!dot || !trail) return;

	let mouseX = 0;
	let mouseY = 0;
	let trailX = 0;
	let trailY = 0;

	window.addEventListener("mousemove", e => {
		mouseX = e.clientX;
		mouseY = e.clientY;

		// Instant tracking for center dot
		dot.style.left = `${mouseX}px`;
		dot.style.top = `${mouseY}px`;
	});

	function animateTrail() {
		// Lower multiplier = more delay (e.g., 0.08 creates a heavy smooth lag)
		// Standard was 0.15, lowered to 0.08 for a pronounced trailing effect
		trailX += (mouseX - trailX) * 0.08;
		trailY += (mouseY - trailY) * 0.08;

		trail.style.left = `${trailX}px`;
		trail.style.top = `${trailY}px`;

		requestAnimationFrame(animateTrail);
	}
	animateTrail();

	// Hover detection via Event Delegation
	document.addEventListener("mouseover", e => {
		if (
			e.target.closest(
				'a, button, input, select, textarea, [role="button"]',
			)
		) {
			trail.classList.add("active");
			dot.classList.add("active");
		}
	});

	document.addEventListener("mouseout", e => {
		if (
			e.target.closest(
				'a, button, input, select, textarea, [role="button"]',
			)
		) {
			trail.classList.remove("active");
			dot.classList.remove("active");
		}
	});
});
document.addEventListener("DOMContentLoaded", () => {
	const dot = document.querySelector(".cursor-dot");
	const trail = document.querySelector(".cursor-trail");

	if (!dot || !trail) return;

	let mouseX = 0;
	let mouseY = 0;
	let trailX = 0;
	let trailY = 0;

	window.addEventListener("mousemove", e => {
		mouseX = e.clientX;
		mouseY = e.clientY;

		dot.style.left = `${mouseX}px`;
		dot.style.top = `${mouseY}px`;
	});

	function animateTrail() {
		trailX += (mouseX - trailX) * 0.08;
		trailY += (mouseY - trailY) * 0.08;

		trail.style.left = `${trailX}px`;
		trail.style.top = `${trailY}px`;

		requestAnimationFrame(animateTrail);
	}
	animateTrail();

	// Event Delegation for buttons/links
	document.addEventListener("mouseover", e => {
		if (
			e.target.closest(
				'a, button, input, select, textarea, [role="button"]',
			)
		) {
			trail.classList.add("active");
			dot.classList.add("active");
		}

		// Expand cursor into halo over main hero title & em tags
		if (e.target.closest("h1.display")) {
			trail.classList.add("hero-hover");
		}
	});

	document.addEventListener("mouseout", e => {
		if (
			e.target.closest(
				'a, button, input, select, textarea, [role="button"]',
			)
		) {
			trail.classList.remove("active");
			dot.classList.remove("active");
		}

		if (e.target.closest("h1.display")) {
			trail.classList.remove("hero-hover");
		}
	});
});
document.getElementById("contactForm")?.addEventListener("submit", async e => {
	e.preventDefault();

	const form = e.target;
	const button = form.querySelector(".send-btn");
	const originalBtnText = button.innerHTML;

	// Update UI to sending state
	button.disabled = true;
	button.innerHTML = "Sending...";

	try {
		const response = await fetch("https://api.web3forms.com/submit", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				// Get your free Access Key at web3forms.com (takes 10 seconds)
				access_key: "981047ac-ae22-453a-8c18-66b2c756ae52",
				name: form.name.value,
				email: form.email.value,
				message: form.message.value,
			}),
		});

		const result = await response.json();

		if (result.success) {
			button.innerHTML = "Sent! ✦";
			button.style.backgroundColor = "#10B981"; // Success Green
			form.reset();

			// Reset button back to normal after 3 seconds
			setTimeout(() => {
				button.disabled = false;
				button.innerHTML = originalBtnText;
				button.style.backgroundColor = "#6c5ce7";
			}, 3000);
		} else {
			throw new Error(result.message);
		}
	} catch (error) {
		button.innerHTML = "Error! Try again";
		button.style.backgroundColor = "#EF4444";

		setTimeout(() => {
			button.disabled = false;
			button.innerHTML = originalBtnText;
			button.style.backgroundColor = "#6c5ce7";
		}, 3000);
	}
});
const projectImages = [
	"images/one.jpg",
	"images/two.jpg",
	"images/three.jpg",
	"images/four.jpg",
	"images/five.jpg",
	"images/six.jpg",
	"images/seven.jpg",
	"images/khaikho.jpg",
	"images/Manipulation.png",
	"images/Tattoo.png",
];

let imageIndex = 0;
const flashImage = document.getElementById("flashImage");
const counterEl = document.getElementById("loaderCounter");
const loaderEl = document.getElementById("pkLoader");

// 1. Preload all images into memory first to stop network lag
const preloadedImages = [];
projectImages.forEach(src => {
	const img = new Image();
	img.src = src;
	preloadedImages.push(img);
});

// 2. Rapid Image Cycle (120ms gives the GPU time to render smoothly)
const imageInterval = setInterval(() => {
	if (flashImage && projectImages.length > 0) {
		imageIndex = (imageIndex + 1) % projectImages.length;
		flashImage.src = projectImages[imageIndex];
	}
}, 120);

// 3. Percentage Loader Logic
let currentPercent = 0;
const countInterval = setInterval(() => {
	currentPercent += Math.floor(Math.random() * 6) + 2; // Smoother increment step

	if (currentPercent >= 100) {
		currentPercent = 100;
		counterEl.textContent = "100%";

		clearInterval(countInterval);
		clearInterval(imageInterval);

		// Trigger exit curtain slide
		setTimeout(() => {
			loaderEl.classList.add("loaded");

			// Remove loader from DOM after transition finishes
			setTimeout(() => {
				loaderEl.style.display = "none";
			}, 800);
		}, 200);
	} else {
		counterEl.textContent = `${String(currentPercent).padStart(3, "0")}%`;
	}
}, 40);
const greetings = [
	"Hello",
	"नमस्ते",
	"Bonjour",
	"Hallo",
	"Hola",
	"こんにちは",
	"Ciao",
	"Olá",
];

let greetingIndex = 0;
const greetingEl = document.getElementById("greeting");

if (greetingEl) {
	setInterval(() => {
		greetingEl.classList.add("fade-out");

		setTimeout(() => {
			greetingIndex = (greetingIndex + 1) % greetings.length;
			greetingEl.textContent = greetings[greetingIndex];
			greetingEl.classList.remove("fade-out");
		}, 750); // Matches the 0.75s transition duration
	}, 3000); // Cycles every 3 seconds for a relaxed feel
}

const contactHeading = document.querySelector("#contact .cta-heading");
const cursorTrail = document.querySelector(".cursor-trail");

if (contactHeading && cursorTrail) {
	contactHeading.addEventListener("mouseenter", () => {
		cursorTrail.classList.add("contact-hover");
	});

	contactHeading.addEventListener("mouseleave", () => {
		cursorTrail.classList.remove("contact-hover");
	});
}

document.addEventListener("DOMContentLoaded", () => {
	const hoverTriggers = document.querySelectorAll(".cursor-target");
	const cursorTrail = document.querySelector(".cursor-trail");

	if (cursorTrail && hoverTriggers.length > 0) {
		hoverTriggers.forEach(el => {
			el.addEventListener("mouseenter", () => {
				cursorTrail.classList.add("expanded-hover");
			});

			el.addEventListener("mouseleave", () => {
				cursorTrail.classList.remove("expanded-hover");
			});
		});
	}
});

document.addEventListener("DOMContentLoaded", () => {
	const cursorTrail = document.querySelector(".cursor-trail");

	if (!cursorTrail) return;

	// 1. About Me Header
	const aboutHeading = document.querySelector("#about h2");
	if (aboutHeading) {
		aboutHeading.addEventListener("mouseenter", () =>
			cursorTrail.classList.add("expanded-hover"),
		);
		aboutHeading.addEventListener("mouseleave", () =>
			cursorTrail.classList.remove("expanded-hover"),
		);
	}

	// 2. Education & Experience Header
	const eduHeading = document.querySelector("#education-certification h2");
	if (eduHeading) {
		eduHeading.addEventListener("mouseenter", () =>
			cursorTrail.classList.add("expanded-hover"),
		);
		eduHeading.addEventListener("mouseleave", () =>
			cursorTrail.classList.remove("expanded-hover"),
		);
	}

	// 3. Selected Work Header
	const workHeading = document.querySelector("#work h2");
	if (workHeading) {
		workHeading.addEventListener("mouseenter", () =>
			cursorTrail.classList.add("expanded-hover"),
		);
		workHeading.addEventListener("mouseleave", () =>
			cursorTrail.classList.remove("expanded-hover"),
		);
	}

	// 4. Contact CTA Header
	const contactHeading = document.querySelector("#contact .cta-heading");
	if (contactHeading) {
		contactHeading.addEventListener("mouseenter", () =>
			cursorTrail.classList.add("expanded-hover"),
		);
		contactHeading.addEventListener("mouseleave", () =>
			cursorTrail.classList.remove("expanded-hover"),
		);
	}
});
