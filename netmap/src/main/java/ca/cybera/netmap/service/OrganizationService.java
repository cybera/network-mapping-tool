package ca.cybera.netmap.service;

import ca.cybera.netmap.model.Organization;

public interface OrganizationService {

	public Organization get(String uuid);
	
	public Organization save(Organization organization);
	
}
