(function($, undefined)
{
	var resumable;
	$.widget("neulion.resumableUpload", {
		options:
		{
			target: "",
			targetArray: "",
			chunkSize: 1*1024*1024,
            simultaneousUploads: 2,
            testChunks: true,
            uploadMethod: 'POST',
            throttleProgressCallbacks: 1,
            prioritizeFirstAndLastChunk :true,
            method: "octet",
            headers:{"Content-Type":"multipart/form-data"}
		},
		_create: function()
		{
			var _self = this;
			resumable = new Resumable({
				target: _self.options.target,
				targetArray: _self.options.targetArray,
	            chunkSize: _self.options.chunkSize,
	            simultaneousUploads: _self.options.simultaneousUploads,
	            testChunks: _self.options.testChunks,
	            uploadMethod: _self.options.uploadMethod,
	            prioritizeFirstAndLastChunk:_self.options.prioritizeFirstAndLastChunk,
	            throttleProgressCallbacks: _self.options.throttleProgressCallbacks,
	            method: _self.options.method,
	            headers:_self.options.headers
			});
			
			//the browser not support
			if($.isFunction(this.options.browserNotSupport) && !resumable.support)
				_self.options.browserNotSupport();
			
			if (resumable.support)
				resumable.assignBrowse(_self.element);
			
			//add the new file
			if ($.isFunction(_self.options.filesAdded))
			{
				resumable.on('filesAdded', function(files)
				{
					_self.options.filesAdded(resumable, files);
		        });
			}
			
			//a file was completed
			if ($.isFunction(_self.options.fileSuccess))
			{
				resumable.on('fileSuccess', function(file)
				{
					_self.options.fileSuccess(resumable, file);
				});
			}
			
			if ($.isFunction(_self.options.fileRetry))
			{
				resumable.on('fileRetry', function(file)
				{
					_self.options.fileRetry(resumable, file);
				});
			}
			
			//error
			if ($.isFunction(_self.options.error))
			{
				resumable.on('error', function(message, file)
				{
					_self.options.error(resumable, file, message);
				});
			}
		}
	});
})(jQuery);