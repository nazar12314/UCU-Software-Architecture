from hazelcast import HazelcastClient
import threading
import time


def write_queue():
    client = HazelcastClient(cluster_name="dev")

    queue = client.get_queue("default").blocking()

    for i in range(100):
        queue.put(i)
        print(f"Put: {i}")

    client.shutdown()


def read_queue(id):
    client = HazelcastClient(cluster_name="dev")
    queue = client.get_queue("default").blocking()

    time.sleep(0.2)

    while not queue.is_empty():
        item = queue.take()
        print(f"{id} consumes: {item}")

    client.shutdown()


if __name__ == "__main__":
    thread1 = threading.Thread(target=write_queue)
    thread2 = threading.Thread(target=read_queue, args=(1,))
    thread3 = threading.Thread(target=read_queue, args=(2,))

    thread1.start()
    thread2.start()
    thread3.start()

    thread1.join()
    thread2.join()
    thread3.join()
