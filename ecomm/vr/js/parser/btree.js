"use strict";

// C++'s bct_Xxx
var bct = {

	RelaxTime : 0x100,
	StitchingSettings : 0x101,
	StitchingClothData : 0x102,
	RobeObjectData : 0x103,
	Geometry  : 0x104,
	//Anchor
	Sewings : 0x200,
	Sewing : 0x201,
	Indexes1 : 0x202,
	Indexes2 : 0x203,
	MeshIndex1 : 0x204,
	MeshIndex2 : 0x205,
	OnBoundingVolume : 0x206,
	Triangles1 : 0x207,
	Triangles2 : 0x208,
	SewingAngle : 0x209,
	//curve
	Curves : 0x300,
	Curve : 0x301,
	Layer : 0x302,
	Name : 0x303,
	Type : 0x304,
	Normal : 0x305,
	Vertices : 0x306,
	VertexSize : 0x307,
	VertexFormat : 0x308,
	Indexes : 0x309,
	Attached : 0x30a,
	AttachedBone : 0x30b,
	MatIdx : 0x30c,
	SubMeshes : 0x30d,
	SubMesh : 0x30e,
	transform : 0x320,
	local_pos : 0x321,
	pivot : 0x322,
	rot_mat : 0x323,
	rounding : 0x324,
	rounding_radius : 0x325,
	rounding_axis_angle : 0x326,

	bind_bounding_volume : 0x340,
	bind_bounding_volume_type : 0x341,
	bind_bounding_volume_pos : 0x342,
	bind_bounding_volume_angle : 0x343,
	Index : 0x344,
	FlatDataFlag : 0x345,

	//material
	Materials : 0x400,
	Material : 0x401,
	Ambient : 0x402,
	Diffuse : 0x403,
	Specular : 0x404,
	Shininess : 0x405,
	VertexProgramName : 0x406,
	FragmentProgramName : 0x407,
	VertexShaderName : 0x408,
	FragmentShaderName : 0x409,
	Textures : 0x420,
	Texture : 0x421,
	TextureFileName : 0x422,
	//PhysicsMaterial
	PhysicsMaterial : 0x500,
	PhysicsMaterialParam : 0x501,
	PhysicsMaterialKey : 0x502,
	PhysicsMaterialValue : 0x503,
	//Overlays
	Overlays : 0x600,
	Overlay : 0x601,
	OverlayVertexDescs : 0x602,
	//Skeleton
	Skeleton : 0x700,
	BoneName : 0x701,
	BoneParentName : 0x702,
	SkeletonPos : 0x703,
	BoneCount : 0x704,
	BoneOriginalPos : 0x705,
	BoneBaseMatr : 0x706,
	BoneReleaseMatr : 0x707,
	BoneBindPoseInv : 0x708,
	Bone : 0x709,
	Bones : 0x70a,
	//animation
	AnimationController : 0x800,
	Skin : 0x801,
	ShapeBindPos : 0x802,
	BoneBindPosVec : 0x803,
	SkinWeight :0x804,
	BoneBindPos : 0x805,
	BonesBindPos : 0x806,
	SkinElement : 0x807,
	VertexWeights : 0x808,
	VertexWeight: 0x809,
	//measurement
	measure_full_length: 0x900,
	measure_vertices: 0x901,
	measure_vertex: 0x902,
	measure_length: 0x903,
	measure_across_shoulders: 0x904,
	measure_shoulder_length: 0x905,
	measure_HPS_to_seam_front: 0x906,
	measure_HPS_to_seam_back: 0x907,
	measure_sleeve_lenght: 0x908,
	measure_across_front: 0x909,
	measure_across_back: 0x910,
	measure_across_chest: 0x911,
	measure_across_underchest: 0x912,
	measure_across_waist: 0x913,
	measure_across_sleeve_bicep: 0x914,
	measure_across_sleeve_elbow: 0x915,
	measure_across_sleeve_opening: 0x916,
	measure_across_armhole_straigth: 0x917,
	measure: 0x918,

};

// C++'s TagMapMng.bctTagMap
var bctTagMap = (function () {

	var map = {};

		map[bct.RelaxTime]  =					"RelaxTime";
		map[bct.StitchingSettings]  =			"StitchingSettings";
		map[bct.StitchingClothData]  =			"StitchingClothData";
		map[bct.RobeObjectData]  =				"RobeObjectData";
		map[bct.Geometry]  =					"Geometry";

		map[bct.Sewings]  =						"Sewings";
		map[bct.Indexes1]  =					"Indexes1";
		map[bct.Indexes2]  =					"Indexes2";
		map[bct.Sewing]  =						"Sewing";
		map[bct.MeshIndex1]  =					"MeshIndex1";
		map[bct.MeshIndex2]  =					"MeshIndex2";
		map[bct.OnBoundingVolume]  =			"OnBoundingVolume";
		
		map[bct.Curves]  =						"Curves";
		map[bct.Curve]  =						"Curve";
		map[bct.Layer]  =						"Layer";
		map[bct.Name]  =						"Name";
		map[bct.Type]  =						"Type";
		map[bct.Normal]  =						"Normal";
		map[bct.Vertices]  =					"Vertices";
		map[bct.VertexSize]  =					"VertexSize";
		map[bct.VertexFormat]  =				"VertexFormat";
		map[bct.Indexes]  =						"Indexes";
		map[bct.Attached]  =					"Attached";
		map[bct.AttachedBone]  =				"AttachedBone";
		map[bct.MatIdx]  =						"MatIdx";
		map[bct.SubMeshes]  =					"SubMeshes";
		map[bct.SubMesh]  =						"SubMesh";
		map[bct.transform]  =					"transform";
		map[bct.local_pos]  =					"local_pos";
		map[bct.pivot]  =						"pivot";
		map[bct.rot_mat]  =						"rot_mat";
		map[bct.rounding]  =					"rounding";
		map[bct.rounding_radius]  =				"rounding_radius";
		map[bct.rounding_axis_angle]  =			"rounding_axis_angle";
		map[bct.bind_bounding_volume]  =		"bind_bounding_volume";
		map[bct.bind_bounding_volume_type]  =	"bind_bounding_volume_type";
		map[bct.bind_bounding_volume_pos]  =	"bind_bounding_volume_pos";
		map[bct.bind_bounding_volume_angle]  =	"bind_bounding_volume_angle";
		map[bct.Index]  =						"Index";
		map[bct.FlatDataFlag]  =				"FlatDataFlag";
		
		map[bct.Materials]  =					"Materials";
		map[bct.Material]  =					"Material";
		map[bct.Ambient]  =						"Ambient";
		map[bct.Diffuse]  =						"Diffuse";
		map[bct.Specular]  =					"Specular";
		map[bct.Shininess]  =					"Shininess";
		map[bct.VertexProgramName]  =			"VertexProgramName";
		map[bct.FragmentProgramName]  =			"FragmentProgramName";
		map[bct.VertexShaderName]  =			"VertexShaderName";
		map[bct.FragmentShaderName]  =			"FragmentShaderName";
		map[bct.Textures]  =					"Textures";
		map[bct.Texture]  =						"Texture";
		map[bct.TextureFileName]  =				"TextureFileName";
		
		map[bct.PhysicsMaterial]  =				"PhysicsMaterial";
		map[bct.PhysicsMaterialParam]  =		"PhysicsMaterialParam";
		map[bct.PhysicsMaterialKey]  =			"PhysicsMaterialKey";
		map[bct.PhysicsMaterialValue]  =		"PhysicsMaterialValue";
		map[bct.PhysicsMaterialKey]  =			"PhysicsMaterialKey";

		map[bct.Overlays]  =					"Overlays";
		map[bct.Overlay]  =						"Overlay";
		map[bct.OverlayVertexDescs]  =			"OverlayVertexDescs";

		map[bct.Skeleton]  =					"Skeleton";
		map[bct.BoneName]  =					"BoneName";
		map[bct.BoneParentName]  =				"BoneParentName";
		map[bct.SkeletonPos]  =					"SkeletonPos";
		map[bct.BoneCount]  =					"BoneCount";
		map[bct.BoneOriginalPos]  =				"BoneOriginalPos";
		map[bct.BoneBaseMatr]  =				"BoneBaseMatr";
		map[bct.BoneReleaseMatr]  =				"BoneReleaseMatr";
		map[bct.BoneBindPoseInv]  =				"BoneBindPoseInv";
		map[bct.Bone]  =						"Bone";
		map[bct.Bones]  =						"Bones";

		map[bct.AnimationController]  =			"AnimationController";
		map[bct.Skin]  =						"Skin";
		map[bct.ShapeBindPos]  =				"ShapeBindPos";
		map[bct.BoneBindPosVec]  =				"BoneBindPosVec";
		map[bct.SkinWeight]  =					"SkinWeight";
		map[bct.BoneBindPos]  =					"BoneBindPos";
		map[bct.BonesBindPos]  =				"BonesBindPos";
	 
		map[bct.SkinElement]  =					"SkinElement";
		map[bct.VertexWeights]  =				"VertexWeights";
		map[bct.VertexWeight]  =				"VertexWeight";

	return map;
})();

var Btree = (function (FileIO) {

	var buffer, nodes = [];

	function BtreeNode (tag) {
		this.firstIndex = 0;
		this.lastIndex = 0;
		this.offset = 0;
		this.parent = null;
		this.size = 0;
		this.tag = tag;
	};

	Object.defineProperty(BtreeNode.prototype, 'data', {
		get: function () {
			return this.dataRef || (this.dataRef = new DataView (buffer, this.offset, this.size));
		}
	});

	BtreeNode.prototype.traverse = function (callback) {
		if (callback (this)) {
			for (var i = this.firstIndex; i <= this.lastIndex; i++) {
				var child = nodes[i];
				if (child.parent == this) {
					child.traverse (callback);
				}
			}
		}
	};

	BtreeNode.prototype.getChild = function (tag) {
		// get first child matching tag, C++'s btree::get_tag but recursive
		var result = null;
		this.traverse (function (node) {
			if (result) return false; if (node.tag == tag) result = node; return (result == null);
		});
		return result;
	};

	BtreeNode.prototype.getChildren = function (tag) {
		var result = [];
		this.traverse (function (node) {
			if (node.tag == tag) { result.push(node); return false; } return true;
		});
		return result;
	};

	BtreeNode.prototype.toString = function (depth) {
		var line = ''; while (line.length < (depth || 0)) line += '\t';
		if (this.tag) {
			line += bctTagMap[this.tag] + '(' + this.tag + ' = 0x' + Number(this.tag).toString(16) + ')';
		} else {
			line += 'Dummy node';
		}

		if (this.data) {
			line += ' ' + this.data.byteLength + ' bytes of data';
		}

		line += '\n';

		var self = this;
		this.traverse (function (node) {
			if (node == self) return true; else line += node.toString ((depth || 0) + 1);
			return false;
		});

		return line;
	};

	function _readHeader(file) {
		var sigView = file.read_buf(4);

		return {
			signature:
				String.fromCharCode(sigView.getUint8(0))+
				String.fromCharCode(sigView.getUint8(1))+
				String.fromCharCode(sigView.getUint8(2))+
				String.fromCharCode(sigView.getUint8(3)),
			major:     file.read_ubyte(),
			minor:     file.read_ubyte()
		};
	}

	function _readTree(file, parentTag) {
		var start = file.pos();
		var size = file.read_uint();

		var parent = new BtreeNode (parentTag);

		parent.firstIndex = nodes.length; nodes.push (parent);
		if (size) {
			while (file.pos() - start < size) {
				var tag = file.read_uint();

				if (!tag) {
					parent.offset = file._buffer.byteOffset + file._offset;
					parent.size = size - ((file.pos() - start) - FileIO.sizeOf.int);
					file.seek(parent.size); break;
					//parent.data = file.read_buf(size	- ((file.pos() - start) - FileIO.sizeOf.int)); break;
				}

				var child = _readTree(file, tag); child.parent = parent; parent.lastIndex = nodes.length - 1;
			}
		}

		return parent;
	}

	function _read(file) {
		var header = _readHeader(file);

		file.seek(FileIO.sizeOf.int); // skeep root tag id

		var root = new BtreeNode ();
		try {
			root = _readTree(file);
		} catch (oops) {
			// not btree
		}

		return {
			header: header,
			root: root
		};
	}

	function Btree (data) {
		buffer = data;

		var tree = _read(new FileIO(data));

		this.getSignature    = function () {
			return tree.header.signature;
		};

		this.getMajorVersion = function () {
			return tree.header.major;
		};

		this.getMinorVersion = function () {
			return tree.header.minor;
		};

		this.getRoot         = function () {
			return tree.root;
		};

		this.toString        = function () {
			return this.getSignature () + ' v' + this.getMajorVersion () + '.' + this.getMinorVersion () + '\n' + tree.root;
		};
	}

	return Btree;

})(window.FileIO);
