package ca.cybera.netmap.service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ca.cybera.netmap.model.Organization;

@Service
@Transactional
public class OrganizationServiceImpl implements OrganizationService {

	@PersistenceContext
	private EntityManager entityManager;

	@Override
	public Organization get(String uuid) {
		return entityManager.find(Organization.class, uuid);
	}

	@Override
	public Organization save(Organization organization) {
		return entityManager.merge(organization);
	}

}
