import java.util.Scanner;
import java.util.Vector;

public class size {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            int total = scanner.nextInt();
            int compare = scanner.nextInt();
            Vector<Integer> mylist = new Vector<Integer>();
            int num;
            int sum = 0;

            for (int i=0; i<total; i++) {
                num = scanner.nextInt();
                mylist.add(num);
            }

            for (int j=0; j<mylist.size(); j++) {
                if (mylist.elementAt(j) <= compare) {
                    sum += 1;
                }
            }

            System.out.println(sum);
        }
    }
}
