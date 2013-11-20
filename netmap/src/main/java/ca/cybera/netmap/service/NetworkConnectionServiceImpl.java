package ca.cybera.netmap.service;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ca.cybera.netmap.model.ConnectionSpeed;
import ca.cybera.netmap.model.Network;
import ca.cybera.netmap.model.NetworkConnection;

@Service
@Transactional
public class NetworkConnectionServiceImpl implements NetworkConnectionService {

	@PersistenceContext
	private EntityManager entityManager;

	@Override
	public NetworkConnection save(NetworkConnection networkConnection) {

		return entityManager.merge(networkConnection);

	}

	@Override
	public NetworkConnection get(String uuid) {

		return entityManager.find(NetworkConnection.class, uuid);

	}

	@Override
	public void delete(NetworkConnection networkConnection) {

		entityManager.remove(networkConnection);

	}

	@Override
	public List<NetworkConnection> get() {

		return entityManager.createQuery("select o from NetworkConnection o", NetworkConnection.class).getResultList();

	}

	@Override
	public List<NetworkConnection> get(Network network) {

		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<NetworkConnection> query = builder.createQuery(NetworkConnection.class);

		Root<NetworkConnection> root = query.from(NetworkConnection.class);
		query.where(builder.equal(root.get("network"), network));

		return entityManager.createQuery(query).getResultList();

	}

	@Override
	public Network save(Network network) {

		return entityManager.merge(network);
	
	}

	@Override
	public List<Network> getNetworks() {

		return entityManager.createQuery("select o from Network o", Network.class).getResultList();

	}

	@Override
	public Network getNetwork(String network) {

		return entityManager.find(Network.class, network);
	
	}

	@Override
	public ConnectionSpeed save(ConnectionSpeed connectionSpeed) {

		return entityManager.merge(connectionSpeed);
		
	}

	@Override
	public List<ConnectionSpeed> getConnectionSpeeds() {

		return entityManager.createQuery("select o from ConnectionSpeed o", ConnectionSpeed.class).getResultList();
	
	}

	@Override
	public ConnectionSpeed getConnectionSpeed(String speed) {
		
		return entityManager.find(ConnectionSpeed.class, speed);
		
	}

}
