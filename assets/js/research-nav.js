(function () {
  "use strict";

  function initResearchNavigation() {
    var researchTarget = document.getElementById("research");
    var researchLink = document.querySelector('[data-nav-section="research"]');
    var visibleLinks = document.querySelector("#site-nav .visible-links");

    if (!researchTarget || !researchLink || !visibleLinks) return;

    var aboutLink = visibleLinks.querySelector('a[href="/"]');
    var aboutItem = aboutLink && aboutLink.closest("li");
    var researchItem = researchLink.closest("li");
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var scrollIntent = false;
    var intentTimer;
    var ticking = false;

    function setActive(section) {
      var researchIsActive = section === "research";

      if (aboutItem) aboutItem.classList.toggle("is-active", !researchIsActive);
      if (researchItem) researchItem.classList.toggle("is-active", researchIsActive);

      if (aboutLink) {
        if (researchIsActive) aboutLink.removeAttribute("aria-current");
        else aboutLink.setAttribute("aria-current", "page");
      }

      if (researchIsActive) researchLink.setAttribute("aria-current", "location");
      else researchLink.removeAttribute("aria-current");
    }

    function mastheadOffset() {
      var masthead = document.querySelector(".masthead");
      return masthead ? masthead.getBoundingClientRect().height + 16 : 86;
    }

    function sectionAtViewport() {
      var scrollMargin = parseFloat(window.getComputedStyle(researchTarget).scrollMarginTop) || 0;
      return researchTarget.getBoundingClientRect().top <= mastheadOffset() + scrollMargin
        ? "research"
        : "about";
    }

    function syncActiveFromScroll() {
      ticking = false;
      if (!scrollIntent) setActive(sectionAtViewport());
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(syncActiveFromScroll);
      }
    }

    function scrollToResearch(updateHistory) {
      window.clearTimeout(intentTimer);
      scrollIntent = true;
      setActive("research");

      if (updateHistory && window.location.hash !== "#research") {
        window.history.pushState({ section: "research" }, "", "#research");
      }

      researchTarget.scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "start"
      });

      intentTimer = window.setTimeout(function () {
        scrollIntent = false;
        setActive(sectionAtViewport());
      }, reducedMotion.matches ? 0 : 700);
    }

    researchLink.addEventListener("click", function (event) {
      event.preventDefault();
      scrollToResearch(true);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", function () {
      if (window.location.hash === "#research") scrollToResearch(false);
      else {
        window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
        setActive("about");
      }
    });

    if (window.location.hash === "#research") {
      window.requestAnimationFrame(function () { scrollToResearch(false); });
    } else {
      setActive(sectionAtViewport());
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initResearchNavigation);
  } else {
    initResearchNavigation();
  }
}());
