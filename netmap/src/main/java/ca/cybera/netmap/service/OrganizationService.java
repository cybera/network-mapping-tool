package ca.cybera.netmap.service;

import java.io.InputStream;
import java.util.List;

import ca.cybera.netmap.model.Organization;
import ca.cybera.netmap.model.OrganizationDisplay;
import ca.cybera.netmap.model.OrganizationType;

public interface OrganizationService {

	public Organization save(Organization organization);

	public Organization get(String uuid);
	
	public void delete(String uuid);

	public List<Organization> get();

	public List<Organization> get(OrganizationType type);

	public OrganizationType save(OrganizationType type);

	public List<OrganizationType> getTypes();
	
	public OrganizationType getType(String type);

	public void deleteType(String uuid);

	public void importKML(InputStream is) throws Exception;

	public List<OrganizationDisplay> getOrgDisplay();

	public void saveOrgDisplay(List<OrganizationDisplay> displays);


	
}
