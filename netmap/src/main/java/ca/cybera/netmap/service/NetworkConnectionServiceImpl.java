package ca.cybera.netmap.service;

import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ca.cybera.netmap.model.ConnectionSpeed;
import ca.cybera.netmap.model.Graph;
import ca.cybera.netmap.model.Network;
import ca.cybera.netmap.model.NetworkConnection;

@Service
@Transactional
public class NetworkConnectionServiceImpl implements NetworkConnectionService {

	@PersistenceContext
	private EntityManager entityManager;
	
	@Value("${graphListUrl}") 
	private String graphListUrl;

	@Value("${graphUrl}") 
	private String graphUrl;

	@Override
	public NetworkConnection save(NetworkConnection networkConnection) {

		return entityManager.merge(networkConnection);

	}

	@Override
	public NetworkConnection get(String uuid) {

		return entityManager.find(NetworkConnection.class, uuid);

	}

	@Override
	public void delete(String uuid) {

		entityManager.remove(get(uuid));

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

	@Override
	public void deleteNetwork(String uuid) {

		entityManager.remove(getNetwork(uuid));

	}

	@Override
	public void deleteConnectionSpeed(String uuid) {

		entityManager.remove(getConnectionSpeed(uuid));

	}

	@Override
	public List<Graph> getGraphs() {
		try {
			URL url = new URL(graphListUrl);
			URLConnection connection = url.openConnection();
			connection.setDoInput(true);
			ObjectMapper mapper = new ObjectMapper();
			GraphsResponse response = mapper.readValue(connection.getInputStream(), GraphsResponse.class);
			
			List<Graph> graphs = new ArrayList<Graph>();
			for (String g : response.getGraphs()) graphs.add(new Graph(graphUrl, g));
			return graphs;
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return null;
	}
}

class GraphsResponse {

	private List<String> graphs;

	public List<String> getGraphs() {
		return graphs;
	}

	public void setGraphs(List<String> graphs) {
		this.graphs = graphs;
	}

}
