package ca.cybera.netmap.service;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ca.cybera.netmap.model.MapStyle;

@Service
@Transactional
public class MapStyleServiceImpl implements MapStyleService {
	@PersistenceContext
	private EntityManager entityManager;
	
	@Override
	public MapStyle save(MapStyle style) {
		return entityManager.merge(style);
	}

	@Override
	public List<MapStyle> get() {
		return entityManager.createQuery("select m from MapStyle m", MapStyle.class).getResultList();

	}

	
}
