/* Default script for mendicité site by AXeL */

/*-------- initMendiciteEnImages --------*/
function createImages(divToAppend, path, extension, index, nbrImages, nameOfClass) {
	for (var i = index; i <= nbrImages; i++) {
		var image = document.createElement('img');
		image.src = path + i + extension;
		//if (nameOfClass != '') // pas vrm la peine
			image.className = nameOfClass;
		divToAppend.appendChild(image);
	}
}

function initMendiciteEnImages() {
	var divMendiciteEnImages = document.getElementById('mendicite-en-images');
	
	createImages(divMendiciteEnImages, 'rsc/images/image_', '.jpg', 2, 7, '');
}

/*-------- initCaricature --------*/
function initCaricature() {
	var divCaricature = document.getElementById('caricature');
	
	createImages(divCaricature, 'rsc/images/caricature_', '.jpg', 1, 7, 'fr');
	createImages(divCaricature, 'rsc/images/ar/caricature_', '.jpg', 8, 14, 'ar');
}

/*-------- initAntiMendicite --------*/
function initAntiMendicite() {
	var divAntiMendicite = document.getElementById('anti-mendicite');
	
	createImages(divAntiMendicite, 'rsc/images/anti_', '.jpg', 1, 4, 'fr');
	createImages(divAntiMendicite, 'rsc/images/ar/anti_', '.jpg', 5, 8, 'ar');
}

/*-------- initAidonsLes --------*/
function initAidonsLes() {
	var divAidonsLes = document.getElementById('aidons-les');
	
	createImages(divAidonsLes, 'rsc/images/aidons_', '.jpg', 1, 3, 'fr');
	createImages(divAidonsLes, 'rsc/images/ar/aidons_', '.jpg', 4, 8, 'ar');
}

/*-------- initFooterImages --------*/
function initFooterImages() {
	var spanFooterImages = document.getElementById('footer_images');
	
	createImages(spanFooterImages, 'rsc/images/merci_', '.jpg', 1, 2, 'fr');
	createImages(spanFooterImages, 'rsc/images/ar/merci_', '.jpg', 3, 4, 'ar');
}

/*-------- initNavBar --------*/
// variables globales
var opacityDegree,
	divToDisplay,
	delay;

function slowDisplay() {
	//alert(opacityDegree);
	divToDisplay.style.opacity = opacityDegree;
	
	if (opacityDegree < 1) {
		opacityDegree += 0.1;
		setTimeout(slowDisplay, delay);
	}
}

function displayDiv(linkElement, divId) {
	// on enlève l'id de l'ancien link séléctionné (balise a)
	var links = linkElement.parentNode.parentNode.firstChild.nextSibling.firstChild;
	while (links) {
		//alert (links);
		if (links.id == 'selected_li') {
			links.id = '';
			break;
		}
		else
			links = links.parentNode.nextSibling.nextSibling.firstChild;
	}
	linkElement.id = 'selected_li'; // on séléctionne le link actuel
	
	// on cache toutes les div du body_middle
	divToDisplay = document.getElementById(divId);
	var divToHide = divToDisplay.parentNode.firstChild.nextSibling.nextSibling.nextSibling;
	while (divToHide) {
		//alert(divToHide);
		if (divToHide.id != undefined) // si div a un id
			divToHide.style.display = 'none';
		divToHide = divToHide.nextSibling.nextSibling;
	}
	
	// on défile/monte en haut de la page
	if (window.scrollY > 0)
		window.scrollBy(0, 0); // 1er param pos axe des x, 2eme axe des y
	
	// on affiche la div souhaitée (divId)
	divToDisplay.style.opacity = 0.0;
	divToDisplay.style.display = 'inline-block';
	opacityDegree = 0.1;
	delay = 60; // 60 milliseconde
	slowDisplay();
}

function initNavBar() {
	var links = document.getElementsByTagName('a'),
		linksLength = links.length;

	for (var i = 0; i < linksLength; i++) {
		var dieseIndex = links[i].href.lastIndexOf('#') + 1;
		// si l'href du lien n'est pas vide (!= '#')
		if (dieseIndex < links[i].href.length) {
			links[i].onclick = function () {
				displayDiv(this, this.href.substring(dieseIndex));
				return false;
			};
		}
	}
}

/*-------- initLangueList --------*/
function initLangueList() {
	var langueList = document.getElementById('langue_list'),
		langueListLi = langueList.children,
		langueListLiLength = langueListLi.length,
		videos = document.getElementsByTagName('video'); // ou on peut utiliser les id (vid_fr, vid_ar)

	for (var i = 0; i < langueListLiLength; i++) {
		langueListLi[i].onclick = function () {
			if (this.id != 'cur_langue') { // si on change de langue
				var ar_elements = document.getElementsByClassName('ar'),
					ar_elementsLength = ar_elements.length,
					fr_elements = document.getElementsByClassName('fr'),
					fr_elementsLength = fr_elements.length,
					link_ref; // pr pouvoir aller à la page d'acceuil
				if (this.innerHTML == 'ar') { // si changement en langue arabe
					for (var i = 0; i < fr_elementsLength; i++) // on cache les éléments en fr
						fr_elements[i].style.display = 'none';
					for (var i = 0; i < ar_elementsLength; i++) { // on affiche les éléments en ar
						ar_elements[i].style.display = 'inline-block';
						// on récupère le premier lien (a) de la nav bar
						if (ar_elements[i].tagName == 'UL')
							link_ref = ar_elements[i].firstChild.nextSibling.firstChild;
					}
					// on change l'alignement du body
					document.body.style.direction = 'rtl'; // right to left
					langueList.style.setProperty('float', 'left'); // on n'oublie pas de changer l'emplacement de la liste des langues aussi
					// on arrête/recharge la vidéo avec des sous-titres fr
					videos[0].load();
					// on cache la vidéo avec des sous-titres fr et on affiche l'autre
					videos[0].style.display = 'none';
					videos[1].style.display = 'block';
					document.title = 'التسول';
				}
				else { // si nn (langue française)
					for (var i = 0; i < ar_elementsLength; i++) // on cache les éléments en ar
						ar_elements[i].style.display = 'none';
					for (var i = 0; i < fr_elementsLength; i++) { // on affiche les éléments en fr
						fr_elements[i].style.display = 'inline-block';
						// on récupère le premier lien (a) de la nav bar
						if (fr_elements[i].tagName == 'UL')
							link_ref = fr_elements[i].firstChild.nextSibling.firstChild;
					}
					// on change l'alignement du body
					document.body.style.direction = 'ltr'; // left to right
					//langueList.style.float = 'right'; // not work on firefox
					langueList.style.setProperty('float', 'right');
					// on arrête/recharge la vidéo avec des sous-titres ar
					videos[1].load();
					// on cache la vidéo avec des sous-titres ar et on affiche l'autre
					videos[1].style.display = 'none';
					videos[0].style.display = 'block';
					document.title = 'La mendicité';
				}

				for (var i = 0; i < langueListLiLength; i++)
					langueListLi[i].id = ''; // on enlève les id

				this.id = 'cur_langue'; // on marque la langue actuelle
				
				displayDiv(link_ref, 'acceuil'); // page d'acceuil
			}
		};
	}
}

/*-------- initAll --------*/
function initAll() {
	initMendiciteEnImages();
	initCaricature();
	initAntiMendicite();
	initAidonsLes();
	initFooterImages();
	initNavBar();
	initLangueList();
}

window.onload = initAll;
