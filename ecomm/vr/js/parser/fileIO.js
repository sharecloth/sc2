"use strict";

var FileIO = (function (DataView, ArrayBuffer) {

	var sizeOf = {
		int: 4,
		byte: 1
	};

	function FileIO(buffer) {
		if (!(buffer instanceof ArrayBuffer)) {
			throw new Error('FileIO must be created from ArrayBuffer');
		}

		this._buffer = new DataView(buffer);
		this._offset = 0;
	}

	FileIO.prototype.read_ubyte = function () {
		var result = this._buffer.getUint8(this._offset, true);
		this._offset += sizeOf.byte;

		return result;
	};

	FileIO.prototype.read_uint = function () {
		var result = this._buffer.getUint32(this._offset, true);
		this._offset += sizeOf.int;

		return result;
	};

	FileIO.prototype.read_buf = function(size) {
		var result = new DataView(
			this._buffer.buffer,
			this._buffer.byteOffset + this._offset,
			size
		);

		this._offset += size;

		return result;
	};

	FileIO.prototype.pos = function() {
		return this._offset;
	};

	FileIO.prototype.seek = function (pos, absolute) {
		if (absolute) {
			this._offset = pos;
		} else {
			this._offset += pos;
		}
	};

	FileIO.sizeOf = sizeOf;

	return FileIO;
})(window.DataView, window.ArrayBuffer);
