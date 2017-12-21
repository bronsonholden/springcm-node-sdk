function Folder(obj) {
	this.name = obj.Name;
	this.created = obj.CreatedDate;
	this.creator = obj.CreatedBy;
	this.updated = obj.UpdatedDate;
	this.updater = obj.UpdatedBy;
	this.desc = obj.Description;
	this.browse = obj.BrowseDocumentsUrl;
	this.access = {
		see: obj.AccessLevel.See,
		read: obj.AccessLevel.Read,
		write: obj.AccessLevel.Write,
		move: obj.AccessLevel.Move,
		create: obj.AccessLevel.Create,
		set: obj.AccessLevel.SetAccess
	};
	this.href = {
		documents: obj.Documents.Href,
		folders: obj.Folders.Href,
		upload: obj.CreateDocumentHref.replace('{?name}', ''),
		self: obj.Href
	};
	this.path = obj.Path || '/' + obj.Name + '/';
}

module.exports = Folder;
