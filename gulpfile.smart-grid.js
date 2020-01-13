module.exports = {
	filename: "_smart-grid",
	outputStyle: 'sass', // SASS or SCSS
	columns: 12,
	offset: "30px", // ширина между колонками (px, %, rem)
	mobileFirst: false,
	container: {
		maxWidth: "1200px", // максимальная ширина контейнера
		fields: "15px" // padding у контейнера слева и справа. Нельзя задавать это значение меньше чем половина межколоночника
	},
	breakPoints: {
		xl: {
			width: "1200px"
		},
		lg: {
			width: "992px",
			fields: "15px"
		},
		md: {
			width: "768px"
		},
		sm: {
			width: "576px"
		}
	},
	mixinNames: {
		container: "container",
		row: "row-flex",
		rowFloat: "row-float",
		rowInlineBlock: "row-ib",
		rowOffsets: "row-offsets",
		column: "col",
		size: "size",
		columnFloat: "col-float",
		columnInlineBlock: "col-ib",
		columnPadding: "col-padding",
		columnOffsets: "col-offsets",
		shift: "shift",
		from: "from",
		to: "to",
		fromTo: "from-to",
		reset: "reset",
		clearfix: "clearfix",
		debug: "debug",
		uRowFlex: "u-row-flex",
		uColumn: "u-col",
		uSize: "u-size"
	},
	tab: "	",
	defaultMediaDevice: "screen",
	detailedCalc: false // включить отображение формулы calc в файле css. Но тогда будут глюки в IE 11 при ресайзе экрана
};