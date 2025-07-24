// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 'introduction'; // Default page
    const pages = document.querySelectorAll('.page');
    const sidebarLinks = document.querySelectorAll('.sidebar ul a');
    const sidebar = document.getElementById('sidebar');
    const openSidebar = document.getElementById('openSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const mainContent = document.querySelector('.main-content');

    // Function to show the selected page and update active link
    function showPage(pageId, expandParents = false) {
        const previousScrollTop = mainContent.scrollTop;

        // Toggle page visibility
        pages.forEach(page => {
            page.classList.toggle('hidden', page.id !== pageId);
        });

        // Update sidebar links
        sidebarLinks.forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector(`.sidebar a[href="#${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');

            // Expand parent nested lists if expandParents is true
            if (expandParents) {
                let parent = activeLink.parentElement;
                while (parent && parent.tagName === 'LI') {
                    const nestedList = parent.querySelector('.nested-list');
                    const toggleIcon = parent.querySelector('.toggle-icon');
                    if (nestedList) {
                        nestedList.classList.add('expanded');
                        if (toggleIcon) toggleIcon.classList.add('expanded');
                    }
                    parent = parent.parentElement.closest('li');
                }
            }
        }

        // Scroll logic
        if (previousScrollTop > 0) {
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Update URL
        history.replaceState(null, '', `#${pageId}`);
        currentPage = pageId;

        // Hide sidebar on mobile after navigation
        if (window.innerWidth < 1024) {
            sidebar.classList.remove('sidebar-open');
            closeSidebar.classList.add('hidden');
            closeSidebar.classList.remove('close-sidebar');
            openSidebar.classList.remove('hidden');
            openSidebar.classList.add('open-sidebar');
        }
    }

    // Function to toggle nested list and icon
    function toggleNestedList(link) {
        const nestedList = link.parentElement.querySelector('.nested-list');
        const toggleIcon = link.querySelector('.toggle-icon');
        if (nestedList) {
            nestedList.classList.toggle('expanded');
            if (toggleIcon) toggleIcon.classList.toggle('expanded');
        }
    }

    // Event listeners for sidebar navigation (only navigate, no toggle)
    sidebarLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.getAttribute('href').replace('#', ''); // e.g., introduction, authentication

            // Navigate to the page without forcing parent expansion (manual click)
            showPage(pageId, false);
        });
    });

    // Event listeners for toggle icons to expand/collapse nested lists
    const toggleIcons = document.querySelectorAll('.toggle-icon');
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent the click from bubbling to the parent <a>
            const link = this.parentElement; // Assuming the icon is inside the <a>
            toggleNestedList(link);
        });
    });

    // Event listeners for next/previous buttons
    document.querySelectorAll('.nav-buttons a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.getAttribute('href').replace('#', '');
            showPage(pageId, true);
        });
    });

    // Toggle sidebar visibility on mobile
    openSidebar.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-open');
        openSidebar.classList.add('hidden');
        openSidebar.classList.remove('open-sidebar');
        closeSidebar.classList.remove('hidden');
        closeSidebar.classList.add('close-sidebar');
    });
    closeSidebar.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-open');
        closeSidebar.classList.add('hidden');
        closeSidebar.classList.remove('close-sidebar');
        openSidebar.classList.remove('hidden');
        openSidebar.classList.add('open-sidebar');
    });

    // Initial page load based on hash
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.getElementById(initialHash)) {
        currentPage = initialHash;
    }
    // Show page and reset scroll with a delay
    showPage(currentPage, true);
    setTimeout(() => {
        mainContent.scrollTop = 0;
    }, 0);

    // Handle hash changes
    window.addEventListener('hashchange', () => {
        const pageId = window.location.hash.replace('#', '') || 'introduction'; // Default to introduction if no hash
        if (document.getElementById(pageId)) {
            currentPage = pageId;
            showPage(pageId, true); // Expand parents on hash change
            setTimeout(() => {
                mainContent.scrollTop = 0;
            }, 0);
        }
    });
});
    