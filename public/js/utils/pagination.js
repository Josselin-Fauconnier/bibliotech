export function renderPagination(container, { currentPage, totalPages, onPageChange }) {
  container.innerHTML = '';
  if (totalPages <= 1) return;

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'pagination');

  const list = document.createElement('ul');
  list.className = 'pagination__list';

  list.appendChild(createNavItem({
    icon: '«',
    srLabel: 'page précédente',
    disabled: currentPage === 1,
    onClick: () => onPageChange(currentPage - 1),
  }));

  for (const page of getPageNumbers(currentPage, totalPages)) {
    const li = document.createElement('li');
    li.appendChild(page === '...'
      ? createEllipsis()
      : createPageButton(page, page === currentPage, () => onPageChange(page)));
    list.appendChild(li);
  }

  list.appendChild(createNavItem({
    icon: '»',
    srLabel: 'page suivante',
    disabled: currentPage === totalPages,
    onClick: () => onPageChange(currentPage + 1),
  }));

  nav.appendChild(list);
  container.appendChild(nav);
}

function getPageNumbers(currentPage, totalPages) {
  const delta = 1;
  const start = Math.max(2, currentPage - delta);
  const end = Math.min(totalPages - 1, currentPage + delta);

  const pages = [1];
  if (start > 2) pages.push('...');
  for (let page = start; page <= end; page++) pages.push(page);
  if (end < totalPages - 1) pages.push('...');
  pages.push(totalPages);
  return pages;
}

function createPageButton(page, isCurrent, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'pagination__page';

  if (isCurrent) {
    button.setAttribute('aria-current', 'page');
    button.disabled = true;
  } else {
    button.addEventListener('click', onClick);
  }

  const srLabel = document.createElement('span');
  srLabel.className = 'sr-only';
  srLabel.textContent = 'page ';
  button.appendChild(srLabel);
  button.appendChild(document.createTextNode(String(page)));
  return button;
}

function createNavItem({ icon, srLabel, disabled, onClick }) {
  const li = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'pagination__btn';
  button.disabled = disabled;
  if (!disabled) button.addEventListener('click', onClick);

  const iconSpan = document.createElement('span');
  iconSpan.setAttribute('aria-hidden', 'true');
  iconSpan.textContent = icon;

  const srSpan = document.createElement('span');
  srSpan.className = 'sr-only';
  srSpan.textContent = srLabel;

  button.appendChild(iconSpan);
  button.appendChild(srSpan);
  li.appendChild(button);
  return li;
}

function createEllipsis() {
  const span = document.createElement('span');
  span.className = 'pagination__ellipsis';
  span.setAttribute('aria-hidden', 'true');
  span.textContent = '…';
  return span;
}
