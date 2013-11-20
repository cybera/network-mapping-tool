package ca.cybera.netmap.service;

import java.util.List;

import ca.cybera.netmap.model.ConnectionSpeed;
import ca.cybera.netmap.model.Network;
import ca.cybera.netmap.model.NetworkConnection;

public interface NetworkConnectionService {

	public NetworkConnection save(NetworkConnection networkConnection);

	public NetworkConnection get(String uuid);

	public void delete(NetworkConnection networkConnection);

	public List<NetworkConnection> get();

	public List<NetworkConnection> get(Network network);

	public Network save(Network network);

	public List<Network> getNetworks();

	public Network getNetwork(String network);

	public ConnectionSpeed save(ConnectionSpeed connectionSpeed);

	public List<ConnectionSpeed> getConnectionSpeeds();

	public ConnectionSpeed getConnectionSpeed(String speed);

}
