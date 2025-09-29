import java.util.Scanner;
import java.util.Vector;

public class sumofarray {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            int total = scanner.nextInt();
            int num;
            int sum = 0;
            Vector<Integer> mylist = new Vector<Integer>();

            for (int i=0; i<total; i++) {
                num = scanner.nextInt();
                mylist.add(num);
            }

            for (int j=0; j<mylist.size(); j++) {
                sum += mylist.elementAt(j);
            }

            System.out.println(sum);
        }
    }
}
