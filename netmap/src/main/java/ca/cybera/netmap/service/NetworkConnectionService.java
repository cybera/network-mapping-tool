package ca.cybera.netmap.service;

import java.util.List;

import ca.cybera.netmap.model.ConnectionSpeed;
import ca.cybera.netmap.model.Graph;
import ca.cybera.netmap.model.Network;
import ca.cybera.netmap.model.NetworkConnection;

public interface NetworkConnectionService {

	public NetworkConnection save(NetworkConnection networkConnection);

	public NetworkConnection get(String uuid);

	public void delete(String uuid);

	public List<NetworkConnection> get();

	public List<NetworkConnection> get(Network network);

	public Network save(Network network);

	public List<Network> getNetworks();
	
	public void deleteNetwork(String uuid);

	public Network getNetwork(String network);

	public ConnectionSpeed save(ConnectionSpeed connectionSpeed);

	public List<ConnectionSpeed> getConnectionSpeeds();

	public ConnectionSpeed getConnectionSpeed(String speed);
	
	public void deleteConnectionSpeed(String uuid);

	public List<Graph> getGraphs();
}
