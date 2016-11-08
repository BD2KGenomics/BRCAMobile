// FAISAL: borrowed form https://gist.github.com/dropfen/4a2209d7274788027f782e8655be198f
// FIXME: this doesn't appear to work with contemporary versions of react-native-vector-icons, sadly

// Define all your icons once,
// load them once,
// and use everywhere

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// define your suffixes by yourself..
// here we use active, big, small, very-big..
const replaceSuffixPattern = /--(active|big|small|very-big|inverse)/g;
const icons = {
  "menu": [30, "#000"],
  "menu--inverse": [30, "#fff"]
}

const defaultIconProvider = MaterialIcons;

let iconsMap = {};
let iconsLoaded = new Promise((resolve, reject) => {
  new Promise.all(
    Object.keys(icons).map(iconName => {
      const Provider = icons[iconName][2] || defaultIconProvider;
      Provider.getImageSource(
        iconName.replace(replaceSuffixPattern, ''),
        icons[iconName][0],
        icons[iconName][1]
      )}
    )
  ).then(sources => {
    Object.keys(icons)
      .forEach((iconName, idx) => iconsMap[iconName] = sources[idx])

    // Call resolve (and we are done)
    resolve(true);
  })
});

export {
    iconsMap,
    iconsLoaded
};
