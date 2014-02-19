package ca.cybera.netmap.service;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ca.cybera.netmap.exception.ValidationException;
import ca.cybera.netmap.model.MapStyle;

@Service
@Transactional
public class MapStyleServiceImpl implements MapStyleService {
	@PersistenceContext
	private EntityManager entityManager;

	@Override
	public MapStyle save(MapStyle style) {
		try {
			MapStyle ms = entityManager.merge(style);
			entityManager.flush();
			return ms;
		} catch (PersistenceException ex) {
			throw new ValidationException("Style name must be unique.");
		}
	}

	public MapStyle get(String uuid) {
		return entityManager.find(MapStyle.class, uuid);
	}

	@Override
	public List<MapStyle> get() {
		return entityManager.createQuery("select m from MapStyle m", MapStyle.class).getResultList();

	}

	@Override
	public void delete(String uuid) {
		entityManager.remove(get(uuid));
	}

}
