export function generateGradientColors(startColor, endColor, steps) {
	// Parse the start and end colors into RGB values
	const startRGB = hexToRGB(startColor);
	const endRGB = hexToRGB(endColor);
  
	const colors = [];
  
	for (let i = 0; i < steps; i++) {
	  const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * (i / (steps - 1)));
	  const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * (i / (steps - 1)));
	  const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * (i / (steps - 1)));
	  const color = RGBToHex(r, g, b);
	  colors.push(color);
	}
  
	return colors;
}
  
function hexToRGB(hex) {
	// Remove the "#" symbol if it's present
	hex = hex.replace(/^#/, '');

	// Parse the hex values into separate R, G, and B values
	const bigint = parseInt(hex, 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;

	return { r, g, b };
}
  
function RGBToHex(r, g, b) {
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

type DateStyle = Intl.DateTimeFormatOptions['dateStyle']

export function formatDate(date: string, dateStyle: DateStyle = 'medium', locales = 'en') {
	// Safari is mad about dashes in the date
	const dateToFormat = new Date(date.replaceAll('-', '/'))
	const dateFormatter = new Intl.DateTimeFormat(locales, { dateStyle })
	return dateFormatter.format(dateToFormat)
}