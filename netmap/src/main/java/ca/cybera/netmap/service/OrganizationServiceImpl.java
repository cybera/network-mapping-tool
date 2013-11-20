package ca.cybera.netmap.service;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ca.cybera.netmap.model.Organization;
import ca.cybera.netmap.model.OrganizationType;

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

	@Override
	public void delete(Organization organization) {

		entityManager.remove(organization);

	}

	@Override
	public List<Organization> get() {

		return entityManager.createQuery("select o from Organization o", Organization.class).getResultList();

	}

	@Override
	public List<Organization> get(OrganizationType type) {

		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Organization> query = builder.createQuery(Organization.class);

		Root<Organization> root = query.from(Organization.class);
		query.where(builder.equal(root.get("organizationType"), type));

		return entityManager.createQuery(query).getResultList();

	}

	@Override
	public OrganizationType save(OrganizationType type) {

		return entityManager.merge(type);

	}

	@Override
	public List<OrganizationType> getTypes() {

		return entityManager.createQuery("select o from OrganizationType o", OrganizationType.class).getResultList();

	}

	@Override
	public OrganizationType getType(String type) {

		return entityManager.find(OrganizationType.class, type);
		
	}

}
