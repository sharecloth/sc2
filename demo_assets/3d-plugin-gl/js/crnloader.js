function CRNLoader () {
	this._parser = CRNLoader.parse;
};

CRNLoader.prototype = Object.create( THREE.CompressedTextureLoader.prototype );
CRNLoader.prototype.constructor = CRNLoader;

CRNLoader.parse = function ( buffer, loadMipmaps ) {

	var dds = { mipmaps: [], width: 0, height: 0, format: null, mipmapCount: 1 };

	var data = new Uint8Array (buffer);
	var srcSize = data.length;
	var src = Crunch._malloc (srcSize);
	Crunch.HEAPU8.set (data, src);
	var width = Crunch._crn_get_width (src, srcSize);
	var height = Crunch._crn_get_height (src, srcSize);
	var levels = Crunch._crn_get_levels (src, srcSize);
	var format = Crunch._crn_get_format (src, srcSize);
	var faces = Crunch._crn_get_faces (src, srcSize);
/*
   data_view = new DataView(data.buffer);
   src_size = data.length;
   src = Crunch._malloc(src_size);
   Crunch.HEAPU8.set(data, src);
   width = data_view.getUint16(12);
   height = data_view.getUint16(14);
   levels = data[16];
   faces = data[17];
   format = data[18];
   additional_levels = data[25];
*/

	dds.width = width;
	dds.height = height;
	dds.mipmapCount = levels;

	var blockBytes;
	if (format == 0) {
		blockBytes = 8;
		dds.format = THREE.RGBA_S3TC_DXT1_Format;
	} else {
		blockBytes = 16;
		dds.format = THREE.RGBA_S3TC_DXT5_Format;
	}

	console.log ('CRNLoader: format=' + format + ' blockBytes=' + blockBytes + ' levels=' + levels + ' ' + width + 'x' + height);

	var context = Crunch._crn_unpack_begin(src, srcSize);
	for (var i = 0; i < levels; i++) {
		var dataLength = (((Math.max(4, width) / 4) * Math.max(4, height)) / 4) * blockBytes;
		var dataOffset = Crunch._crn_unpack_level(context, src, srcSize, i);
		var byteArray = new Uint8Array(Crunch.HEAPU8.buffer, dataOffset, dataLength);
		// buffer = Crunch.HEAPU8.buffer.slice(data_offset, (data_offset + data_length));


		var mipmap = { data: byteArray, width: width, height: height };
		dds.mipmaps.push( mipmap );

		Crunch._free(dataOffset);
		width >>= 1;
		height >>= 1;
	}

	Crunch._crn_unpack_end(context);
	Crunch._free(src);

	return dds;
};