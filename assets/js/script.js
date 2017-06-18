var apiBase = 'http://api.edmunds.com/api/';
var apiBaseV1 = 'https://api.edmunds.com/v1/api/';
var apiKey = '4eupz2an4h2wznvzqjt6uhm9';

function populateMakes(data)
{
	var makes = data.makes;
	jQuery('#make').empty();
	jQuery('#make').append($('<option>', {
	    value: '0',
	    text: 'Select'
	}));
	for(var i = 0; i < makes.length; i++)
	{
		var make = makes[i];
		jQuery('#make').append($('<option>', {
		    value: make.niceName,
		    text: make.name
		}));
	}
}

function populateModels(make)
{
	jQuery.ajax(
	{
		url: apiBase+'vehicle/v2/'+make+'/models?fmt=json&api_key='+apiKey,
		type: 'GET',
		success: function(data)
		{
			var models = data.models;
			jQuery('#model').empty();
			jQuery('#model').append($('<option>', {
			    value: '0',
			    text: 'Select'
			}));
			for(var i = 0; i < models.length; i++)
			{
				var model = models[i];
				jQuery('#model').append($('<option>', {
					value: model.niceName,
					text: model.name
				}));
			}
		}
	});
}

function populateYears(make, model)
{
	jQuery.ajax({
		url: apiBase+'vehicle/v2/'+make+'/'+model+'?fmt=json&api_key='+apiKey,
		type: 'GET',
		success: function(data)
		{
			var years = data.years;
			jQuery('#year').empty();
			jQuery('#year').append($('<option>', {
			    value: '0',
			    text: 'Select'
			}));
			for(var i = 0; i < years.length; i++)
			{
				var year = years[i];
				jQuery('#year').append($('<option>', {
					value: year.year,
					text: year.year
				}));
			}
		}
	});
}

function populateStyles(make, model, year)
{
	jQuery.ajax({
		url: apiBase+'vehicle/v2/'+make+'/'+model+'/'+year+'/styles?fmt=json&api_key='+apiKey,
		type: 'GET',
		success: function(data)
		{
			var styles = data.styles;
			jQuery('#style').empty();
			jQuery('#style').append($('<option>', {
			    value: '0',
			    text: 'Select'
			}));
			for(var i = 0; i < styles.length; i++)
			{
				var style = styles[i];
				jQuery('#style').append($('<option>', {
					value: style.id,
					text: style.name
				}));
			}
		}
	});
}

function populateVehicleData(style, status)
{
	var makeText = jQuery("#make :selected").text();
	var modelText = jQuery("#model :selected").text();
	var styleText = jQuery("#style :selected").text();
	var yearText = jQuery("#year :selected").text();
	
	var engineUrl = apiBase+'vehicle/v2/styles/'+style+'/engines?fmt=json&api_key='+apiKey;
	jQuery.ajax({
		url: engineUrl,
		type: 'GET',
		success: function(data)
		{
			var engines = data.engines;
			var engine = null;
			var transmission = null;
			if(engines.length > 0)
			{
				engine = engines[0];
			}
			var transmissionUrl = apiBase+'vehicle/v2/styles/'+style+'/transmissions?fmt=json&api_key='+apiKey;
			jQuery.ajax({
				url: transmissionUrl,
				type: 'GET',
				success: function(data)
				{
					var transmissions = data.transmissions;
					if(transmissions.length > 0)
					{
						transmission = transmissions[0];
					}
					jQuery('#car-box-title').text(makeText + " " + modelText + " " +styleText);
					jQuery('#car-name').text(makeText + " " + modelText + " " +styleText + " (" + yearText + ")");
					
					if(engine != null)
					{
						$('#size').text(engine.size);
						$('#cylinder').text(engine.cylinder);
						$('#displacement').text(engine.displacement);
						$('#horsepower').text(engine.horsepower);
						$('#torque').text(engine.torque);
						$('#totalValves').text(engine.totalValves);
						$('#fuelType').text(engine.fuelType);					}
					if(transmission != null)
					{
						$('#transmission').text(transmission.name);
						$('#transmissionType').text(transmission.transmissionType);
						$('#numberOfSpeeds').text(transmission.numberOfSpeeds);
					}
					
					if(status != '0')
					{
						if(status == 'new')
						{
							var priceUrl = apiBaseV1+'tmv/tmvservice/calculatenewtmv?styleid='+style+'&zip=90019&fmt=json&api_key='+apiKey;
							jQuery.ajax({
								url: priceUrl,
								type: 'GET',
								success: function(data)
								{
									var tmv = data.tmv;
									var nationalPrice = tmv.nationalBasePrice;
									
									var msrp = nationalPrice.baseMSRP;
									$('#msrp').text(msrp);
									
									var tmv = nationalPrice.tmv;
									var retail = nationalPrice.usedTmvRetail;
									var privateParty = nationalPrice.usedPrivateParty;
									var tradeIn = nationalPrice.usedTradeIn;
									
									var newContainer = $('#new-container');
									newContainer.find('.tmv').text(tmv);
									newContainer.find('.retail').text(retail);
									newContainer.find('.private-party').text(privateParty);
									newContainer.find('.tradein').text(tradeIn);
									
									$('#new-container').show();
									$('#outstanding-container').hide();
									$('#clean-container').hide();
									$('#average-container').hide();
									$('#rough-container').hide();
									$('#damaged-container').hide();
									$('#car-info-container').show();
								},
								error: function()
								{
									$('#new-container').show();
									$('#outstanding-container').hide();
									$('#clean-container').hide();
									$('#average-container').hide();
									$('#rough-container').hide();
									$('#damaged-container').hide();
									$('#car-info-container').show();
								}
							});
						}
						else if(status == 'used')
						{
							var outstandingUrl = apiBaseV1+'tmv/tmvservice/calculateusedtmv?styleid='+style+'&zip=90019&mileage=25000&condition=Outstanding&fmt=json&api_key='+apiKey;
							
							jQuery.ajax({
								url: outstandingUrl,
								type: 'GET',
								success: function(data)
								{
									var tmv = data.tmv;
									var nationalPrice = tmv.nationalBasePrice;
									
									var msrp = nationalPrice.baseMSRP;
									$('#msrp').text(msrp);
									
									var tmv = nationalPrice.tmv;
									var retail = nationalPrice.usedTmvRetail;
									var privateParty = nationalPrice.usedPrivateParty;
									var tradeIn = nationalPrice.usedTradeIn;
									
									var outstandingContainer = $('#outstanding-container');
									outstandingContainer.find('.tmv').text(tmv);
									outstandingContainer.find('.retail').text(retail);
									outstandingContainer.find('.private-party').text(privateParty);
									outstandingContainer.find('.tradein').text(tradeIn);
								}
							});
							
							var cleanUrl = apiBaseV1+'tmv/tmvservice/calculateusedtmv?styleid='+style+'&zip=90019&mileage=25000&condition=Clean&fmt=json&api_key='+apiKey;
							
							jQuery.ajax({
								url: cleanUrl,
								type: 'GET',
								success: function(data)
								{
									var tmv = data.tmv;
									var nationalPrice = tmv.nationalBasePrice;
									var tmv = nationalPrice.tmv;
									var retail = nationalPrice.usedTmvRetail;
									var privateParty = nationalPrice.usedPrivateParty;
									var tradeIn = nationalPrice.usedTradeIn;
									
									var cleanContainer = $('#clean-container');
									cleanContainer.find('.tmv').text(tmv);
									cleanContainer.find('.retail').text(retail);
									cleanContainer.find('.private-party').text(privateParty);
									cleanContainer.find('.tradein').text(tradeIn);
								}
							});
							
							var averageUrl = apiBaseV1+'tmv/tmvservice/calculateusedtmv?styleid='+style+'&zip=90019&mileage=25000&condition=Average&fmt=json&api_key='+apiKey;
							
							jQuery.ajax({
								url: averageUrl,
								type: 'GET',
								success: function(data)
								{
									var tmv = data.tmv;
									var nationalPrice = tmv.nationalBasePrice;
									var tmv = nationalPrice.tmv;
									var retail = nationalPrice.usedTmvRetail;
									var privateParty = nationalPrice.usedPrivateParty;
									var tradeIn = nationalPrice.usedTradeIn;
									
									var averageContainer = $('#average-container');
									averageContainer.find('.tmv').text(tmv);
									averageContainer.find('.retail').text(retail);
									averageContainer.find('.private-party').text(privateParty);
									averageContainer.find('.tradein').text(tradeIn);
								}
							});
							
							var roughUrl = apiBaseV1+'tmv/tmvservice/calculateusedtmv?styleid='+style+'&zip=90019&mileage=25000&condition=Rough&fmt=json&api_key='+apiKey;
							
							jQuery.ajax({
								url: roughUrl,
								type: 'GET',
								success: function(data)
								{
									var tmv = data.tmv;
									var nationalPrice = tmv.nationalBasePrice;
									var tmv = nationalPrice.tmv;
									var retail = nationalPrice.usedTmvRetail;
									var privateParty = nationalPrice.usedPrivateParty;
									var tradeIn = nationalPrice.usedTradeIn;
									
									var roughContainer = $('#rough-container');
									roughContainer.find('.tmv').text(tmv);
									roughContainer.find('.retail').text(retail);
									roughContainer.find('.private-party').text(privateParty);
									roughContainer.find('.tradein').text(tradeIn);
								}
							});
							
							var damagedUrl = apiBaseV1+'tmv/tmvservice/calculateusedtmv?styleid='+style+'&zip=90019&mileage=25000&condition=Damaged&fmt=json&api_key='+apiKey;
							
							jQuery.ajax({
								url: damagedUrl,
								type: 'GET',
								success: function(data)
								{
									var tmv = data.tmv;
									var nationalPrice = tmv.nationalBasePrice;
									var tmv = nationalPrice.tmv;
									var retail = nationalPrice.usedTmvRetail;
									var privateParty = nationalPrice.usedPrivateParty;
									var tradeIn = nationalPrice.usedTradeIn;
									
									var damagedContainer = $('#damaged-container');
									damagedContainer.find('.tmv').text(tmv);
									damagedContainer.find('.retail').text(retail);
									damagedContainer.find('.private-party').text(privateParty);
									damagedContainer.find('.tradein').text(tradeIn);
									
									$('#new-container').hide();
									$('#outstanding-container').show();
									$('#clean-container').show();
									$('#average-container').show();
									$('#rough-container').show();
									$('#damaged-container').show();
									
									$('#car-info-container').show();
								}
							});
						}
					}
					
					jQuery.ajax({
						url: apiBase+'media/v2/styles/'+style+'/photos?fmt=json&api_key='+apiKey,
						type: 'GET',
						success: function(data)
						{
							var photoFound = false;
							var photos = data.photos;
							for(var i = 0; i < photos.length; i++)
							{
								var photoCat = photos[i];
								if(photoCat.category == 'EXTERIOR')
								{
									var srcs = photoCat.sources;
									for(var m = 0; m < srcs.length; m++)
									{
										var src = srcs[m];
										if(src.size.width > 300)
										{
											var href = src.link.href;
											$('#photo-container').empty();
											$('#photo-container').append('<img class="car-image" src="http://media.ed.edmunds-media.com'+href+'"/>');
											photoFound = true;
											break;
										}
									}	
								}
								if(photoFound == true)
								{
									break;
								}
							}
							if(photoFound == false)
							{
								$('#photo-container').empty();
								$('#photo-container').append('<img class="car-image" src="https://cdn4.iconfinder.com/data/icons/car-silhouettes/1000/sedan-512.png"/>');
							}
						}
					});
				}
			});
		}
	});
}

function fetchVehicles()
{
	var style = $('#style').val();
	var status = $('#status').val();
	populateVehicleData(style, status);
}

jQuery(document).ready(function($)
{
	jQuery.ajax({
		url: apiBase+'vehicle/v2/makes?fmt=json&api_key='+apiKey,
		type: 'GET',
		success: function(data)
		{
			populateMakes(data);
		}
	});
	
	jQuery('#make').change(function()
	{
		$('#car-info-container').hide();
		
		$('#model').empty();
		$('#year').empty();
		$('#style').empty();
		
		var makeVal = $(this).val();
		populateModels(makeVal);
	});
	
	jQuery('#model').change(function()
	{
		$('#car-info-container').hide();
		
		$('#year').empty();
		$('#style').empty();
		
		var makeVal = $('#make').val();
		var modelVal = $(this).val();
		populateYears(makeVal, modelVal);
	});
	
	jQuery('#year').change(function()
	{
		$('#car-info-container').hide();
		
		$('#style').empty();
		var makeVal = $('#make').val();
		var modelVal = $('#model').val();
		var yearVal = $(this).val();
		
		populateStyles(makeVal, modelVal, yearVal);
	});
	
	jQuery('#style').change(function()
	{
		$('#car-info-container').hide();
	});
	
	jQuery('#status').change(function()
	{
		$('#car-info-container').hide();
	});
});