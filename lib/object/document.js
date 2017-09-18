function Document(obj) {
	this.name = obj.Name;
	this.created = obj.CreatedDate;
	this.creator = obj.CreatedBy;
	this.updated = obj.UpdatedDate;
	this.updater = obj.UpdatedBy;
	this.desc = obj.Description;
	this.browse = obj.BrowseDocumentsUrl;
	this.size = obj.NativeFileSize;
	this.access = {
		see: obj.AccessLevel.See,
		read: obj.AccessLevel.Read,
		write: obj.AccessLevel.Write,
		move: obj.AccessLevel.Move,
		create: obj.AccessLevel.Create,
		set: obj.AccessLevel.SetAccess
	};
	this.href = {
		parent: obj.ParentFolder.Href,
		share: obj.PreviewUrl,
		self: obj.Href,
		download: obj.DownloadDocumentHref
	};
}

module.exports = Document;
