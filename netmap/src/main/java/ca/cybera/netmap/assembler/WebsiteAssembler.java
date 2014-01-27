package ca.cybera.netmap.assembler;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import ca.cybera.netmap.dto.WebsiteDTO;
import ca.cybera.netmap.model.Website;

@Component
public class WebsiteAssembler {
	
	@Value("${graphUrl}") 
	private String graphUrl;
	
	public Website assemble(WebsiteDTO dto) {
		Website website = new Website();
		
		website.setUUID(dto.getUUID());
		website.setLabel(dto.getLabel());
		website.setUrl(dto.getUrl().replace(graphUrl, "{graphUrl}"));
		
		return website;
	}
	
	public WebsiteDTO getDTO(Website website) {
		WebsiteDTO dto = new WebsiteDTO();
		
		dto.setUUID(website.getUUID());
		dto.setLabel(website.getLabel());
		dto.setUrl(website.getUrl().replace("{graphUrl}", graphUrl));
		
		return dto;
	}
	
	public List<Website> assemble(List<WebsiteDTO> dto) {
		if (dto == null) return null;
		List<Website> websites = new ArrayList<Website>();
		for (WebsiteDTO d : dto) websites.add(assemble(d));
		return websites;
	}
	
	public List<WebsiteDTO> getDTO(List<Website> websites) {
		if (websites == null) return null;
		List<WebsiteDTO> dto = new ArrayList<WebsiteDTO>();
		for (Website w : websites) dto.add(getDTO(w));
		return dto;
	}
}
