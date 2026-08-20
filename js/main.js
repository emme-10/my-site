(function () {
  const projects = [
    { name: "Georgia Courts CMS",   tags: ["Government"],    img: "assets/GCMS_Portfolio Picture.jpeg",  desc: "Streamlining justice: Building a Court Case Management System for the State of Georgia" },
    { name: "PD Event Registration",   tags: ["Education"],      img: "assets/ProfReg_Portfolio Picture.jpeg",  desc: "Empowering educators through simplified professional development registration" },
    { name: "Benefits Administration", tags: ["Health & Benefits"],       img: "assets/HB_Portfolio Picture.jpeg",  desc: "Accelerating seamless health & benefits administration" },
    { name: "Call Center Platform",  tags: ["Finance"], img: "assets/Call Center_Portfolio Picture.jpg",  desc: "Transforming the call center agent experience by designing a unified platform of agent tools" },
    { name: "Internal Ops Tool",  tags: ["Finance"], img: "assets/Internal Ops_Portfolio Picture.jpeg",  desc: "Redesigning an internal bonus application & employee management tool" },
    { name: "Risk Analyst Accelerator",   tags: ["Finance"],   img: "assets/Risk Analyst_Portfolio Picture.jpeg",  desc: "Improving risk analyst workflow efficiency" }
  ];

  const canvas = document.getElementById("projectCanvas");
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalTag = document.getElementById("modalTag");
  const modalDesc = document.getElementById("modalDesc");
  const modalClose = document.getElementById("modalClose");

  let sharedCard = null;
  let activeHoverNode = null;

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  // Positions the shared fixed card relative to the viewport so it never clips.
  function positionCard(node, card) {
    const nodeRect = node.getBoundingClientRect();
    const cardW = card.offsetWidth || card.scrollWidth;
    // offsetHeight is 0 before first paint; scrollHeight always returns true content height.
    const cardH = card.offsetHeight || card.scrollHeight;
    const gap = 8;
    const margin = 16;

    const showBelow = nodeRect.top - cardH - gap < margin;
    card.classList.toggle("node-card--below", showBelow);

    let cardTop = showBelow
      ? nodeRect.bottom + gap
      : nodeRect.top - cardH - gap;
    cardTop = clamp(cardTop, margin, window.innerHeight - margin - cardH);

    const cardLeft = clamp(
      nodeRect.left + nodeRect.width / 2 - cardW / 2,
      margin,
      window.innerWidth - margin - cardW
    );

    card.style.top = `${cardTop}px`;
    card.style.left = `${cardLeft}px`;
  }

  function toTagsText(tags) {
    if (Array.isArray(tags)) return tags.join(" • ");
    return String(tags || "");
  }

  function buildPositions() {
    const cols = 3;
    const rows = 2;
    return projects.map((_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cellW = 100 / cols;
      const cellH = 82 / rows;
      const jitterX = (Math.random() * 14) - 7;
      const jitterY = (Math.random() * 18) - 9;
      const x = clamp((col + 0.5) * cellW + jitterX, 8, 92);
      const y = clamp((row + 0.5) * cellH + 11 + jitterY, 20, 88);
      return { x, y };
    });
  }

  function openModal(project) {
    modalTitle.textContent = project.name;
    modalTag.textContent = toTagsText(project.tags);
    modalDesc.textContent = project.desc;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  function renderMobileStack() {
    document.querySelector(".mobile-stack")?.remove();

    const stack = document.createElement("section");
    stack.className = "mobile-stack";
    stack.setAttribute("aria-label", "Project portfolio");

    projects.forEach((project, i) => {
      const tagsText = toTagsText(project.tags);

      const card = document.createElement("article");
      card.className = "mobile-card";
      card.style.transitionDelay = `${i * 80}ms`;
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", project.name);

      const media = document.createElement("div");
      media.className = "node-card-media";
      media.setAttribute("aria-hidden", "true");
      if (project.img) {
        const img = document.createElement("img");
        img.src = project.img;
        img.alt = "";
        img.className = "mobile-card-img";
        media.appendChild(img);
      }

      const content = document.createElement("div");
      content.className = "node-card-content";

      const header = document.createElement("div");
      header.className = "node-card-header";

      const name = document.createElement("p");
      name.className = "name";
      name.textContent = project.name;

      const pill = document.createElement("p");
      pill.className = "tag-pill";
      pill.textContent = tagsText;

      const desc = document.createElement("p");
      desc.className = "desc";
      desc.textContent = project.desc;

      header.appendChild(name);
      header.appendChild(pill);
      content.appendChild(header);
      content.appendChild(desc);
      card.appendChild(media);
      card.appendChild(content);

      card.addEventListener("click", () => openModal(project));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(project);
        }
      });

      stack.appendChild(card);
    });

    document.body.appendChild(stack);

    // Animate cards in as they scroll into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("mobile-card--visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    stack.querySelectorAll(".mobile-card").forEach((c) => observer.observe(c));
  }

  function renderNodes() {
    canvas.querySelectorAll(".node").forEach((node) => node.remove());
    document.querySelector(".node-card")?.remove();
    activeHoverNode = null;

    sharedCard = document.createElement("div");
    sharedCard.className = "node-card";
    sharedCard.setAttribute("aria-hidden", "true");
    sharedCard.innerHTML = `
      <div class="node-card-media" aria-hidden="true"></div>
      <div class="node-card-content">
        <div class="node-card-header">
          <p class="name"></p>
          <p class="tag-pill"></p>
        </div>
        <p class="desc"></p>
      </div>
    `;
    document.body.appendChild(sharedCard);

    const positions = buildPositions();

    projects.forEach((project, i) => {
      const wrap = document.createElement("div");
      wrap.className = "node";
      wrap.dataset.nodeId = `project-${i + 1}`; // Adds data-node-id="project-1", etc.
      wrap.style.setProperty("--x", positions[i].x + "%");
      wrap.style.setProperty("--y", positions[i].y + "%");
      wrap.style.setProperty("--delay", (-i * 0.42) + "s");
      wrap.style.setProperty("--dur", (6 + (i % 3) * 1.1) + "s");

      const tagsText = toTagsText(project.tags);

      const label = document.createElement("div");
      label.className = "node-label";
      label.innerHTML = `
        <p class="node-label-title">${project.name}</p>
        <p class="node-label-tags">${tagsText}</p>
      `;

      const btn = document.createElement("button");
      btn.className = "node-btn";
      btn.type = "button";
      btn.setAttribute("aria-label", `${project.name} (${tagsText})`);
      btn.addEventListener("click", () => openModal(project));

      wrap.appendChild(label);
      wrap.appendChild(btn);
      canvas.appendChild(wrap);

      function showCard() {
        activeHoverNode = wrap;
        const motionState = nodeMotion.find(s => s.node === wrap);
        if (motionState) motionState.hovering = true;
        sharedCard.querySelector(".name").textContent = project.name;
        sharedCard.querySelector(".tag-pill").textContent = tagsText;
        sharedCard.querySelector(".desc").textContent = project.desc;
        const media = sharedCard.querySelector(".node-card-media");
        media.style.backgroundImage = project.img ? `url("${project.img}")` : "";
        positionCard(wrap, sharedCard);
        sharedCard.classList.add("node-card--visible");
        wrap.style.zIndex = "10";
      }

      function hideCard() {
        if (wrap.dataset.dragging) return;
        const motionState = nodeMotion.find(s => s.node === wrap);
        if (motionState) {
          // Recalculate the sine offset at this exact moment so home snaps
          // to a value that makes the node resume from its frozen position.
          const t = performance.now() / 1000;
          const ox =
            Math.sin((t * 0.42) + motionState.phaseX) * motionState.radiusX +
            Math.sin((t * 0.73) + motionState.phaseY) * motionState.radiusX * 0.28;
          const oy =
            Math.cos((t * 0.36) + motionState.phaseY) * motionState.radiusY +
            Math.sin((t * 0.61) + motionState.phaseX) * motionState.radiusY * 0.24;
          motionState.homeX = motionState.currentX - ox;
          motionState.homeY = motionState.currentY - oy;
          motionState.hovering = false;
        }
        activeHoverNode = null;
        sharedCard.classList.remove("node-card--visible");
        wrap.style.zIndex = "2";
      }

      wrap.addEventListener("mouseenter", showCard);
      wrap.addEventListener("mouseleave", hideCard);
      wrap.addEventListener("focusin", showCard);
      wrap.addEventListener("focusout", hideCard);
    });
  }

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  renderNodes();
  renderMobileStack();

  const connectionLayer = document.getElementById("connectionLayer");

  /* Intentional mesh: every project has 2–4 connections. */
  const connections = [
    { from: "project-1", to: "project-2" },
    { from: "project-1", to: "project-3" },
    { from: "project-1", to: "project-4" },
    { from: "project-2", to: "project-3" },
    { from: "project-2", to: "project-5" },
    { from: "project-2", to: "project-6" },
    { from: "project-3", to: "project-5" },
    { from: "project-3", to: "project-6" },
    { from: "project-4", to: "project-5" },
    { from: "project-4", to: "project-6" },
    { from: "project-5", to: "project-6" }
  ];

  /* Prevents duplicate and reversed duplicate connections. */
  const uniqueConnections = connections.filter((connection, index, all) => {
    const key = [connection.from, connection.to].sort().join(":");

    return index === all.findIndex((item) => {
      return [item.from, item.to].sort().join(":") === key;
    });
  });

  const svgNamespace = "http://www.w3.org/2000/svg";
  const connectionPaths = [];

  function getNodeCenter(node, canvasBounds) {
    const nodeBounds = node.getBoundingClientRect();

    return {
      x: nodeBounds.left - canvasBounds.left + (nodeBounds.width / 2),
      y: nodeBounds.top - canvasBounds.top + (nodeBounds.height / 2)
    };
  }

  function updateConnections() {
    const canvasBounds = canvas.getBoundingClientRect();

    connectionLayer.setAttribute(
      "viewBox",
      `0 0 ${canvasBounds.width} ${canvasBounds.height}`
    );

    connectionPaths.forEach(({ path, fromId, toId }) => {
      const fromNode = canvas.querySelector(`.node[data-node-id="${fromId}"]`);
      const toNode = canvas.querySelector(`.node[data-node-id="${toId}"]`);

      if (!fromNode || !toNode) {
        path.hidden = true;
        return;
      }

      const from = getNodeCenter(fromNode, canvasBounds);
      const to = getNodeCenter(toNode, canvasBounds);

      path.hidden = false;
      path.setAttribute("d", `M ${from.x} ${from.y} L ${to.x} ${to.y}`);
    });
  }

  function createConnections() {
    uniqueConnections.forEach(({ from, to }) => {
      const path = document.createElementNS(svgNamespace, "path");

      path.classList.add("edge");
      path.setAttribute("vector-effect", "non-scaling-stroke");

      connectionLayer.appendChild(path);
      connectionPaths.push({
        path,
        fromId: from,
        toId: to
      });
    });

    updateConnections();
  }

  createConnections();
  window.addEventListener("resize", updateConnections);

  const field = document.querySelector(".field");
  const nodeMotion = [];
  let motionFrameId = null;

  /*
    Keeps a node's center inside the field.
    Both field and node dimensions are measured live so resizing remains safe.
  */
  const DRAG_PADDING = 20;

  function clampNodePosition(node, x, y) {
    const fieldBounds = field.getBoundingClientRect();
    const nodeBounds = node.getBoundingClientRect();
    const halfNodeWidth = nodeBounds.width / 2;
    const halfNodeHeight = nodeBounds.height / 2;

    return {
      x: clamp(x, halfNodeWidth + DRAG_PADDING, fieldBounds.width - halfNodeWidth - DRAG_PADDING),
      y: clamp(y, halfNodeHeight + DRAG_PADDING, fieldBounds.height - halfNodeHeight - DRAG_PADDING)
    };
  }

  function setNodePosition(node, x, y) {
    node.style.setProperty("--x", `${x}px`);
    node.style.setProperty("--y", `${y}px`);
  }

  /*
    Converts the initially percentage-positioned nodes to pixel home positions,
    then gives each node its own smooth floating pattern.
  */
  function initializeNodeMotion() {
    const fieldBounds = field.getBoundingClientRect();

    field.querySelectorAll(".node").forEach((node, index) => {
      const nodeBounds = node.getBoundingClientRect();

      const initialPosition = {
        x: nodeBounds.left - fieldBounds.left + (nodeBounds.width / 2),
        y: nodeBounds.top - fieldBounds.top + (nodeBounds.height / 2)
      };

      const home = clampNodePosition(node, initialPosition.x, initialPosition.y);

      setNodePosition(node, home.x, home.y);

      const state = {
        node,
        homeX: home.x,
        homeY: home.y,
        currentX: home.x,
        currentY: home.y,
        dragX: home.x,
        dragY: home.y,
        dragging: false,
        hovering: false,

        // Each node gets a distinct, slow, layered orbit.
        phaseX: index * 1.73,
        phaseY: index * 2.41,
        radiusX: 30 + ((index * 7) % 21), // 30–50px
        radiusY: 28 + ((index * 11) % 19), // 28–46px
        didDrag: false
      };

      nodeMotion.push(state);

      node.addEventListener("pointerdown", (event) => {
        state.dragging = true;
        state.didDrag = false;

        node.setPointerCapture(event.pointerId);
        node.dataset.dragging = "1";
        node.style.zIndex = "3";

        event.preventDefault();
      });

      node.addEventListener("pointermove", (event) => {
        if (!state.dragging || !node.hasPointerCapture(event.pointerId)) {
          return;
        }

        const currentFieldBounds = field.getBoundingClientRect();

        const nextPosition = clampNodePosition(
          node,
          event.clientX - currentFieldBounds.left,
          event.clientY - currentFieldBounds.top
        );

        state.dragX = nextPosition.x;
        state.dragY = nextPosition.y;
        state.didDrag = true;
      });

      function releaseNode(event) {
        if (!state.dragging) {
          return;
        }

        state.dragging = false;
        state.homeX = state.dragX;
        state.homeY = state.dragY;
        delete node.dataset.dragging;
        node.style.zIndex = "2";

        if (node.hasPointerCapture(event.pointerId)) {
          node.releasePointerCapture(event.pointerId);
        }
      }

      node.addEventListener("pointerup", releaseNode);
      node.addEventListener("pointercancel", releaseNode);

      // Prevents a drag-release from also opening the project modal.
      node.addEventListener("click", (event) => {
        if (state.didDrag) {
          event.preventDefault();
          event.stopPropagation();
          state.didDrag = false;
        }
      }, true);
    });
  }

  /*
    One shared frame loop:
    - Floating nodes use layered sine/cosine movement.
    - Dragged nodes follow their latest pointer position.
    - SVG endpoints update every frame for smooth tracking.
  */
  function animateNodeMotion(timestamp) {
    const time = timestamp / 1000;

    nodeMotion.forEach((state) => {
      let nextX;
      let nextY;

      if (state.dragging) {
        nextX = state.dragX;
        nextY = state.dragY;
      } else if (state.hovering) {
        nextX = state.currentX;
        nextY = state.currentY;
      } else {
        const offsetX =
          Math.sin((time * 0.42) + state.phaseX) * state.radiusX +
          Math.sin((time * 0.73) + state.phaseY) * state.radiusX * 0.28;

        const offsetY =
          Math.cos((time * 0.36) + state.phaseY) * state.radiusY +
          Math.sin((time * 0.61) + state.phaseX) * state.radiusY * 0.24;

        const floatingPosition = clampNodePosition(
          state.node,
          state.homeX + offsetX,
          state.homeY + offsetY
        );

        nextX = floatingPosition.x;
        nextY = floatingPosition.y;
      }

      state.currentX = nextX;
      state.currentY = nextY;
      setNodePosition(state.node, nextX, nextY);
    });

    if (activeHoverNode && sharedCard?.classList.contains("node-card--visible")) {
      positionCard(activeHoverNode, sharedCard);
    }

    // Existing SVG line system updates continuously while nodes float or drag.
    updateConnections();

    motionFrameId = requestAnimationFrame(animateNodeMotion);
  }

  requestAnimationFrame(() => {
    initializeNodeMotion();
    motionFrameId = requestAnimationFrame(animateNodeMotion);
  });

  window.addEventListener("resize", () => {
    nodeMotion.forEach((state) => {
      const clampedHome = clampNodePosition(
        state.node,
        state.homeX,
        state.homeY
      );

      state.homeX = clampedHome.x;
      state.homeY = clampedHome.y;
    });
  });
})();