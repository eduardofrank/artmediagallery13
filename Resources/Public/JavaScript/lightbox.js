window.addEventListener('DOMContentLoaded', function () {

    /**
     * Open PhotoSwipe with caption below the image (site override of BP bootstrap.lightbox.js).
     */
    const openPhotoSwipe = function (index, gid) {

        const items = [];
        Array.from(document.querySelectorAll('a.lightbox[rel=' + gid + ']')).forEach(function (element) {
            let title = null;
            if ("lightboxTitle" in element.dataset && element.dataset.lightboxTitle !== '') {
                title = element.dataset.lightboxTitle
            }
            let alternative = null;
            if ("lightboxAlt" in element.dataset && element.dataset.lightboxAlt !== '') {
                alternative = element.dataset.lightboxAlt
            }
            let caption = null;
            if ("lightboxCaption" in element.dataset && element.dataset.lightboxCaption !== '') {
                caption = element.dataset.lightboxCaption
                caption = caption.replace(/(?:\r\n|\r|\n)/g, '<br />');
            }

            let imgElement = null;
            if (element.querySelector('img')) {
                imgElement = element.querySelector('img');
            } else if (element.parentElement.querySelector('img')) {
                imgElement = element.parentElement.querySelector('img');
            }

            let item = {
                id: Array.from(document.querySelectorAll('a.lightbox[rel=' + gid + ']')).indexOf(element),
                src: element.getAttribute('href'),
                width: element.dataset.lightboxWidth,
                height: element.dataset.lightboxHeight,
                title: title,
                alt: alternative,
                caption: caption,
                element: element,
                imgElement: imgElement,
            };

            items.push(item);
        });

        if (items.length > 0) {
            const gallery = new PhotoSwipeLightbox({
                dataSource: items,
                spacing: 0.12,
                bgOpacity: 1,
                showHideAnimationType: 'zoom',
                pswpModule: PhotoSwipe
            });
            gallery.addFilter('thumbEl', (thumbEl, data, index) => {
                if (data.imgElement) {
                    return data.imgElement;
                }
                return thumbEl;
            });
            new PhotoSwipeDynamicCaption(gallery, {
                type: 'below',
                mobileLayoutBreakpoint: 0,
                captionContent: (slide) => {
                    const item = slide.data;
                    let content = '';
                    if (item.title && item.title !== '') {
                        content += '<div class="pswp__dynamic-caption__title">' + item.title + '</div>';
                    }
                    if (item.caption && item.caption !== '') {
                        content += '<div class="pswp__dynamic-caption__subtitle">' + item.caption + '</div>';
                    }
                    return content;
                }
            });
            let captionViewportBar = null;

            const syncCaptionViewportBar = (pswp) => {
                const slide = pswp.currSlide;
                const captionEl = slide && slide.dynamicCaption && slide.dynamicCaption.element;
                const holder = slide && slide.holderElement;

                if (!captionEl || !holder ||
                    captionEl.classList.contains('pswp__dynamic-caption--faded') ||
                    captionEl.style.visibility === 'hidden' ||
                    !captionEl.classList.contains('pswp__dynamic-caption--below')) {
                    if (captionViewportBar) {
                        captionViewportBar.hidden = true;
                    }
                    return;
                }

                const rect = captionEl.getBoundingClientRect();
                if (rect.height <= 0) {
                    if (captionViewportBar) {
                        captionViewportBar.hidden = true;
                    }
                    return;
                }

                if (!captionViewportBar) {
                    captionViewportBar = document.createElement('div');
                    captionViewportBar.className = 'pswp__caption-viewport-bar';
                    captionViewportBar.setAttribute('aria-hidden', 'true');
                }

                if (captionViewportBar.parentElement !== holder) {
                    holder.insertBefore(captionViewportBar, captionEl);
                } else if (captionViewportBar.nextElementSibling !== captionEl) {
                    holder.insertBefore(captionViewportBar, captionEl);
                }

                const bleed = 2;
                const pswpRect = pswp.element.getBoundingClientRect();
                captionViewportBar.hidden = false;
                captionViewportBar.style.top = (rect.top - pswpRect.top - bleed) + 'px';
                captionViewportBar.style.left = '0';
                captionViewportBar.style.width = '100%';
                captionViewportBar.style.height = (rect.height + bleed * 2) + 'px';
            };

            gallery.on('firstUpdate', () => {
                const pswp = gallery.pswp;
                pswp.element.setAttribute('aria-modal', true);
                pswp.scrollWrap.ariaLabel = 'carousel';
                pswp.scrollWrap.removeAttribute('aria-roledescription');

                const sync = () => {
                    requestAnimationFrame(() => {
                        syncCaptionViewportBar(pswp);
                    });
                };

                pswp.on('change', sync);
                pswp.on('zoomPanUpdate', sync);
                pswp.on('resize', sync);
                sync();
            });
            gallery.init();
            gallery.loadAndOpen(index);
        }
    }

    Array.from(document.querySelectorAll('a.lightbox')).forEach(function (element) {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const gid = element.getAttribute('rel');
            const index = Array.from(document.querySelectorAll('a.lightbox[rel=' + gid + ']')).indexOf(element);
            openPhotoSwipe(index, gid);
        });
    });

});
